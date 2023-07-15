(block) @scope

; Functions
(function_definition
  name: (ident) @definition.function)
(parameter
  name: (ident) @definition.parameter)

; Variables
(let_stmt
  name: (ident) @definition.var)
(for_stmt
  name: (ident) @definition.var)

; References
(ident) @reference
