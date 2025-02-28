import XCTest
import SwiftTreeSitter
import TreeSitterRush

final class TreeSitterRushTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_rush())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading rush grammar")
    }
}
