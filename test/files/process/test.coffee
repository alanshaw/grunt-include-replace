class Module

  sayHello: (name) ->
    @@include('included.coffee', {"indent": "4"})