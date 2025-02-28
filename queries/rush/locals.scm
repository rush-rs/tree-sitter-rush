(block) @local.scope

; Functions
(function_definition
  name: (ident) @local.definition.function)
(parameter
  name: (ident) @local.definition.var)

; Variables
(let_stmt
  name: (ident) @local.definition.var)
(for_stmt
  name: (ident) @local.definition.var)

; References
(ident) @local.reference
