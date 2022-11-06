# tree-sitter-rush

[rush](https://github.com/rush-rs/rush) grammar for
[tree-sitter](https://github.com/tree-sitter/tree-sitter)

## Usage in Neovim

### Parser Installation

The [nvim-treesitter plugin](https://github.com/nvim-treesitter/nvim-treesitter)
does not include this parser. To use it you must instead manually add it to your
tree-sitter config and then install it with `:TSInstall rush` or by adding it to
your `ensure_installed` list:

```lua
require('nvim-treesitter.parsers').get_parser_configs().rush = {
    install_info = {
        url = 'https://github.com/rush-rs/tree-sitter-rush.git',
        files = { 'src/parser.c' },
        branch = 'main',
    },
}
```

### File type detection

You will likely also have to add the `rush` file type:

```lua
vim.filetype.add { extension = { rush = 'rush' } }
```

### Highlighting and Indentation

If you want to use this parser for highlighting and indentation, you will also
have to add this repository as a plugin, for example for packer.nvim add this:

```lua
use { 'rush-rs/tree-sitter-rush' }
```
