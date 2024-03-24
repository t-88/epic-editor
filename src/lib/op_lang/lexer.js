import BaseParser from "./base_parser"

let TokenType = { 
        // single tokens
        "OPara":"OPara",
        "CPara":"CPara",
        "OCurl":"OCurl",
        "CCurl":"CCurl",
        "OBrak":"OBrak",
        "CBrak":"CBrak",
        "Dot":"Dot",
        "Comma":"Comma",
        "Equal":"Equal",
        "SemiColon":"SemiColon",
        "Add":"Add",
        "Minus":"Minus",
        "Mult":"Mult",
        "Div":"Div",
        "Bigger":"Bigger",
        "Lesser":"Lesser",
        
        // two || more tokens
        "Equality":"Equality",
        "BiggerOrEqual":"BiggerOrEqual",
        "LesserOrEqual":"LesserOrEqual",
        
        // literals
        "Identifier":"Identifier",
        "String":"String",
        "Number":"Number",
        
        // keywords
        "_if" :"_if",
        "And":"And",
        "Or":"Or",
        "Func":"Func",
        "Return":"Return",
        "false" :"false",
        "true":"true",
        "_for":"_for",
        "_in":"_in",

        // function
        "Outer_Func": "Outer_Func",
}


let SINGLE_TOKENS_MAP = {
    "(" : TokenType.OPara     ,
    ")" : TokenType.CPara     ,
    "{" : TokenType.OCurl     ,
    "}" : TokenType.CCurl     ,
    "[" : TokenType.OBrak     ,
    "]" : TokenType.CBrak     ,
    "." : TokenType.Dot       ,
    "," : TokenType.Comma     ,
    "=" : TokenType.Equal     ,
    ";" : TokenType.SemiColon ,
    "+" :  TokenType.Add      ,
    "-" :  TokenType.Minus    ,
    "*" :  TokenType.Mult     ,
    "/" :  TokenType.Div      ,
    ">" : TokenType.Bigger,
    "<" : TokenType.Lesser,
    
}
let SINGLE_TOKENS = Object.keys(SINGLE_TOKENS_MAP)

let DOUBLE_OR_MORE_TOKENS_MAP = {
    "==" : TokenType.Equality,
    ">=" : TokenType.BiggerOrEqual,
    "=<" : TokenType.LesserOrEqual,
}
let DOUBLE_OR_MORE_TOKENS = Object.keys(DOUBLE_OR_MORE_TOKENS_MAP)

let KEYWORDS_MAP = {
    "func"   : TokenType.Func,
    "return" : TokenType.Return,
    "false"  : TokenType.false,
    "true"   : TokenType.true,
    "if"   : TokenType._if,
    "for"   : TokenType._for,
    "in"   : TokenType._in,
} 
let KEYWORDS = Object.keys(KEYWORDS_MAP)

let FUNCTIONS = ["print"]

let SKIPABLE_TOKENS = [" ", "\n", "\t"]

class Token {
    constructor(type,val) {
        this.type =  type
        this.val = val
    }
}

function isAlpha (ch){
    return typeof ch === "string" && ch.length === 1 && /[A-Za-z]/.test(ch);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export default class Lexer extends BaseParser {
    constructor() {
        super()
        this.tokens = []
    }
        
    tokenize(src) {
        this.idx = 0
        this.src = src
        this.tokens = []
        while(this.idx < this.src.length) {
            let chr = this.next()

            if(SINGLE_TOKENS.includes(chr)) {
                if(this.idx < this.src.length && DOUBLE_OR_MORE_TOKENS.includes(chr + this.cur())) {
                    this.tokens.push(new Token(DOUBLE_OR_MORE_TOKENS_MAP[chr + this.cur()],chr + this.cur()))
                    this.next()
                } 
                else {
                    this.tokens.push(new Token(SINGLE_TOKENS_MAP[chr],chr))
                }
            }
            else if( chr == '"' || chr == "'") {
                stop = chr
                let word = ""
                while (this.idx < this.src.length && this.cur() != stop) {
                    word += this.next()
                }
            this.next()
            this.tokens.push(new Token(TokenType.String,word)) 
            } else if(isAlpha(chr)) {
                let word = chr
                while(this.idx < this.src.length && (isAlpha(this.cur()) || this.cur() == "_")) {
                    word +=  this.next()
                }
                let typ = TokenType.Identifier
                if(KEYWORDS.includes(word)) {
                    typ = KEYWORDS_MAP[word] 
                }
                else if(FUNCTIONS.includes(word)) {
                    typ = TokenType.Outer_Func 
                }
                this.tokens.push(new Token(typ,word))
            }
            else if(isNumeric(chr)) {
                let word = chr
                while(this.idx < this.src.length && isNumeric(this.cur())) {
                    word +=  this.next()
                }
                this.tokens.push(new Token(TokenType.Number,word))
            }
            else if(SKIPABLE_TOKENS.includes(chr)) { }
            else {
                console.log(`[Lexer Error] Unexpected token '${chr}'`)
                throw(`[Lexer Error] Unexpected token '${chr}'`);
            }
        }
        return this.tokens
    }
}