# Vue2pyj
Experimental webIDE with embedded [Rapydscript](https://github.com/atsepkov/RapydScript) for web2py (Node.js is not required)

Vue3pyj for web3py is [here](https://github.com/valq7711/vue3pyj)
## Installation
Just clone or download and unpack this repo in your web2py/applications/vue2pyj folder (you can use any name instead of vue2pyj)

There is also **todo** application as an example (that is ported from web3py).

To compile it do the following:

0. Unpack todo.w2p in your web2py/applications folder
1. Go to [vue2pyj/default/index](http://127.0.0.1:8000/vue2pyj/default/index)
2. Choose **todo** app to edit from the list that will appear
3. Click **todo** from the menu - you will see todo folder content
4. Go to **vuepy** folder and click on *app_layout.vuepy* to open it
5. Click compile from the menu - it will be compiled to views/app_layout.html   
6. Open and compile *index.vuepy* (as the previous one) - it will be compiled to 2 files: *views/index.html* and *static/js/index.js*
7. Now try [todo/default/index](http://127.0.0.1:8000/todo/default/index)


## Understanding vuepy files
Vuepy file could consist of several parts (all parts are optional): 
```python
# vuepy/foo.vuepy

#This is the RapydML-like part - will be compiled to views/foo.html
html:
    head:
    ...
    body:
        div(id = 'app'):
    script(src = "{{=URL('static', 'js/foo.js')}}"):
    
# This is vue template part - will be compiled to html string 
# and injected into v-pyj part as foo_templ variable (see below)    
v-def foo_templ:
  div:
      vtitle(title = '...'):
      ul:
          li(v-for = 'it in items'): '${it}'
  ...
  
# This is v-pyj part (regular rapydscript) - will be compiled to static/js/foo.js    
v-pyj:
    # template will be injected here as variable:
    #foo_templ = '''
    #<div>
    #    <vtitle title = '...'></vtitle>
    #    <ul>
    #       ...
    #    </ul>
    #</div>
    #'''
    
    # it's also possible to import title.vuepy (if we have one) as regular pyj file!
    # it will be compiled to pyj on-the-fly and returned to rapydscript compiler  
    import title # - Note, that we just import title.vuepy, title.html/js files will not be created     
    vopt = {
        template: foo_templ, 
        delimiters:['${','}'],
        data:{items[...]},
        el:'#app',
        components:{'vtitle': title.vopt}
    }
    def main():
        app = new Vue(vopt)
    if __name__=='__main__':
        main()
```

## Vue components: pythonic way
There are some base classes that allow writing vue-components in more pythonic way. Let's have a look at the scaffold:
```python
# todos.vuepy
v-def todos_templ:
    ...
    
v-pyj:
    # asset package is placed in the vuepy folder (it is a git-submodule)  
    from asset.rs_vue import RS_vue, V_collector
    
    # V_collector - holds a set of decorators to collect vue-specific options  
    vc = V_collector()
    
    # RS_vue - the base class that unpacks the collected options into the properties of the instance,
    # does something like this: self.methods = vc._methods
    
    class Todos(RS_vue):
        def __init__(self):
            super(vc) # pass the collected options to RS_vue
            self.template = todos_templ
            self.props = {...}
            
        # this will goes to the data-option
        def _init_data(self):
            return {
                items:[...]
            }
       
        @vc.meth
        def edit_item(self, item_id):
            # self == this == vue-component instance
            item = self.items.find(def(it): return it.id == item_id;) 
            ...
            
        @vc.computed
        def last_item(self):
            return self.items[-1]

        # watch for items
        @vc.watch  # or  @vc.watch({deep: True}) to watch for each item
        def items(self, nv, ov):
            ...
        
        # in case of watching for the computed property
        # we have to use another name for the watcher 
        @vc.watch('last_item') 
        def last_item_watch_or_something_else(slelf, nv, ov):
            ...
         
        # life hooks goes as is 
        def created(self):
            ...

def make():
    return Todos()

#========================== END of todos.vuepy ==============================
# now we can:
# app.vuepy
...
v-pyj:
    import todos
    ...
    Vue.options.components = { todos: todos.make()}
    # or
    class App(RS_vue):
        def __init__(self):
            ...
            self.components = { todos: todos.make()}
    ...
    app = new Vue(App())
```


