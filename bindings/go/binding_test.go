package tree_sitter_rush_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_rush "github.com/rush-rs/tree-sitter-rush/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_rush.Language())
	if language == nil {
		t.Errorf("Error loading rush grammar")
	}
}
