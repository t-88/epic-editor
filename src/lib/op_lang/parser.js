    


let StatementType = { 
    // base types
    "Number":"Number",
    "String":"String",
    "Identifier":"Identifier",
    "ArthOp":"ArthOp",    
    "BooleanOp":"BooleanOp",    
    "VarAssigment":"VarAssigment",
    "Para":"Para",
    "Block":"Block", 
    "Conditional":"Conditional",
    "ForIteration":"ForIteration",
    
    // key nodes
    "Program":"Program",
    "FuncCall":"FuncCall",
    "FuncDeclaration":"FuncDeclaration",
    "TableLookup":"TableLookup",
}

let OP_MAP = {
    "+" : "Add",
    "-" : "Sub",
    "*" : "Mul",
    "/" : "Div",
    ">" : "Bigger",
    "<" : "Lesser",
    ">=" : "Bigger Or Equal",
    "=<" : "Lesser Or Equal",
    "==" : "Equal",
}

let LOOKUP_TABLES = ["Components","Keys"]

class Statement {
    constructor(typ,val = "") {
        this.type = typ
        this.val = val
    }
}

class ExprProgram extends Statement {
    constructor() {
        super(StatementType.Program);
        this.statements = []
    }
}
class ExprArithOp extends Statement {
    constructor(left,right,exp) {
        super(StatementType.ArthOp);
        this.left = left                
        this.right = right    
        this.op = op    
    }
}
       
class ExprBoolOp extends Statement {
    constructor(left,right,op) {
        super(StatementType.BooleanOp);
        this.left = left                
        this.right = right    
        this.op = op    
    }
}

class ExprPara extends Statement {
    constructor(expr) {
        super(StatementType.Para)
        this.expr = expr                
    }
}
class StatBlock extends Statement {
    constructor(block) {
        super(StatementType.Block)
        this.block = block
    }
}
class StatVarAssigment extends Statement {
    constructor(name,val) {
        super(StatementType.VarAssigment);
        this.name = name                
        this.val = val    
    }
}

class StatConditional extends Statement {
    constructor(condition,block) {
        super(StatementType.Conditional)
        this.condition = condition                
        this.block = block    
    }
}

class StatForLoop extends Statement {
    constructor(variable,start,end,block) {
        super(StatementType.ForIteration)
        this.variable = variable                
        this.start = start                
        this.end = end                
        this.block = block                
    }
}


class StatFuncCall extends Statement {
    constructor(name,args) {
        super(StatementType.FuncCall)
        this.name = name                
        this.args = args    
    }
}

class StatFuncDeclartion extends Statement {
    constructor(name,args,body) {
        super(StatementType.FuncDeclaration)
        this.name = name                
        this.body = body    
        this.args = args
    }
}

class StatTableLookup extends Statement {
    constructor(table,key) {
        super(StatementType.TableLookup)
        this.table = table                
        this.key = key    

    }
}


class OPParser extends BaseParser {
    constructor() {
        super()
        this.program = undefined
        this.lexer = Lexer()
        this.src = []
    }
        
    expect(typ) {
        if(this.cur().type != typ) {
            console.log(this.program.statements)
            console.log(this.idx)
            console.log(`[Parser Expect Error] expected ${typ} got ${this.cur().type}`)
            throw(`[Parser Expect Error] expected ${typ} got ${this.cur().type}`)
        }
    }

    parse(src) {
        this.src = this.lexer.tokenize(src)
        this.idx = 0
        this.program = new ExprProgram()
        while(this.idx < this.src.length) {
            let node = this.parse_statements()
            this.program.statements.push(node)
        }
        return this.program    
    }

    parse_statements() {
        if(this.cur().type == TokenType.OCurl)
            return this.parse_block()
        else if (this.cur().type == TokenType._if)
            return this.parse_conditional()
        else if (this.cur().type == TokenType._for)
            return this.parse_for_loop()
        else if (this.cur().type == TokenType.Func)
            return this.parse_func_declartion()
        else {
            let expr =  this.parse_func_call()
            this.expect(TokenType.SemiColon)
            this.next()            
            return expr
        }
    }

    parse_block() {
        this.next()
        let block = []
        while (this.cur().type != TokenType.CCurl) 
            block.push(this.parse_statements())
        this.next()        
        return new StatBlock(block)
    }

    parse_conditional() {
        this.next()
        let condition = this.parse_boolean_ops()
        let block = this.parse_block()
        return new StatConditional(condition,block)     
    }


    parse_for_loop() {
        this.next()
        this.expect(TokenType.OPara); this.next()
        let variable = this.parse_literal()
        this.expect(TokenType._in); this.next()
        let start = this.parse_literal()
        this.expect(TokenType.Dot); this.next();this.expect(TokenType.Dot); this.next();
        let end = this.parse_literal()
        this.expect(TokenType.CPara); this.next()
        let block = this.parse_block()
        return new StatForLoop(variable,start,end,block)
    }
          
    
    parse_func_call() {
        if (this.cur().type == TokenType.Identifier && this.cur(1).type == TokenType.OPara && this.cur().type == TokenType.Outer_Func) {
            let name = this.next().val
            this.expect(TokenType.OPara)
            this.next()
            
            let args = []
            while(this.cur().type != TokenType.CPara) {
                args.push(this.parse_var_assigment())
                if(this.cur().type != TokenType.CPara) {
                    this.expect(TokenType.Comma)
                    this.next()
                }

            }
                
            this.expect(TokenType.CPara)
            this.next()            
    
            return new StatFuncCall(name,args)
        }
     
        return this.parse_var_assigment()
    
    }
        
       
    parse_func_declartion() {
        this.next()
        let name =  this.next().val
        this.expect(TokenType.OPara)
        this.next()
        
        args = []
        while(this.cur().type != TokenType.CPara) {
            args.push(this.parse_literal().val)
            if(this.cur().type != TokenType.CPara) {
                this.expect(TokenType.Comma)
                this.next()
            }
        }
        
        this.expect(TokenType.CPara)
        this.next()
        
        let body = this.parse_statements()
        return new StatFuncDeclartion(name,args,body)
    }
             
    parse_var_assigment() {
        if(this.cur().type == TokenType.Identifier) {
            let name = this.cur().val
            
            let i = 1
            while(this.cur(i).type == TokenType.Dot && this.cur(i + 1).type == TokenType.Identifier) {
                name += this.cur(i).val + this.cur(i + 1).val
                i += 2
            }

            if(this.idx < this.src.length && this.cur(i).type == TokenType.Equal) {
                for (let j = 0; j < i; j++) {
                    this.next()
                }
                this.next()
                val = this.parse_func_call()
            }

            return new StatVarAssigment(name,val)
        }

        return this.parse_boolean_ops()
    }

    parse_boolean_ops() {
        let left = this.parse_addition_subtraction()
        while (this.idx < this.src.length && this.cur().type in [TokenType.Equality,TokenType.Bigger, TokenType.BiggerOrEqual,TokenType.Lesser,TokenType.LesserOrEqual]) {
            let op = this.next().val
            let right = this.parse_addition_subtraction()
            left =  new ExprBoolOp(op,left,right)        
        }
        return left
    }
               
    parse_addition_subtraction() {
        let left = this.parse_muliplication()
        
        while(this.idx < this.src.length && this.cur().type in  [TokenType.Add , TokenType.Minus]) {
            let op = this.next().val
            let right = this.parse_muliplication()
            left =  new ExprArithOp(op,left,right)        
        }
        return left
    }

    parse_muliplication() {
        let left = this.parse_para()

        while (this.idx < this.src.length && (this.cur().type == TokenType.Mult && this.cur().type == TokenType.Div)) {
            let op = this.next().val
            let right = this.parse_para()
            left =  ExprArithOp(op,left,right)
        }
        return left
    }
    
    
    parse_para() {
        if(this.idx < this.src.length && this.cur().type == TokenType.OPara) {
            this.next()
            let expr = this.parse_func_call()
            this.expect(TokenType.CPara)
            this.next()

            return new ExprPara(expr)
        }
        return this.parse_dot_notation()    
    }
   
    
    parse_dot_notation() {
        if (this.cur().type == TokenType.Identifier && this.cur().val in LOOKUP_TABLES && this.cur(1).type == TokenType.Dot) {
            let table =  this.next().val
            this.next()
            this.expect(TokenType.Identifier)
            let key =  this.next().val
            return new StatTableLookup(table,key)
        }
        return this.parse_literal()
    }
            
    parse_literal() {
        let tkn = this.next()
        if (tkn.type == TokenType.String) {
            return new Statement(StatementType.String,tkn.val)
        }
        else if(tkn.type == TokenType.Number || tkn.type == TokenType.Minus) {
            if(tkn.type == TokenType.Minus) {
                num = this.cur().val; this.next()
                return new Statement(StatementType.Number,"-"+num)
            }
            else {
                return new Statement(StatementType.Number,tkn.val)
            }                
        }
        else if(tkn.type == TokenType.Identifier) {
            let i = 0
            let name = tkn.val
            while (this.cur(i).type == TokenType.Dot && this.cur(i + 1).type == TokenType.Identifier) {
                name += this.cur(i).val + this.cur(i + 1).val
                i += 2
            }
            for (let _ = 0; _ < i; _++) {
                this.next()
            }
            return new Statement(StatementType.Identifier,name)

        }
        else if(tkn.type == TokenType.CCurl || tkn.type == TokenType.CPara) {
            this.idx -= 1
            return undefined
        }
        else {
            print(`[Parser Error] Unexpected literal '${tkn}'`)
            throw(`[Parser Error] Unexpected literal '${tkn}'`)
        }
    }

 
    print_tree(node = undefined,depth = 0) {
        if(node == undefined) {
            this.print_tree(this.program)
            return 
        } 

        let sep = "  " * depth
        if(node.type == StatementType.Program) {
            print("program")
            for (let i = 0; i < node.statements.length; i++) {
                this.print_tree(node.statements[i],depth + 1)
            }
        }
        else if (node.type == StatementType.String)
            print(sep +  "string " + node.val)
        else if (node.type == StatementType.Number)
            print(sep + "number " + node.val)
        else if (node.type == StatementType.Identifier)
            print(sep +  "identifier " + node.val)
        else if (node.type == StatementType.ArthOp) {
            print(sep + OP_MAP[node.op])
            this.print_tree(node.left , depth + 1)
            this.print_tree(node.right, depth + 1)
        }
        else if (node.type == StatementType.BooleanOp) {
            print(sep + OP_MAP[node.op])
            this.print_tree(node.left , depth + 1)
            this.print_tree(node.right, depth + 1)            
        }
        else if (node.type == StatementType.VarAssigment) {
            print(sep + "Var Assign")
            print(sep + node.name)
            this.print_tree(node.val , depth + 1)
        }
        else if (node.type == StatementType.Para) {
            print(sep + "Para")
            this.print_tree(node.expr , depth + 1)            
        }
        else if (node.type == StatementType.Block) {
            print(sep + "Block")
            for (let i = 0; i < node.block.length; i++) {
                this.print_tree(node.block[i],depth + 1)
            }
        }
        else if (node.type == StatementType.Conditional) {
            print(sep + "Conditional")
            this.print_tree(node.condition , depth + 1)                     
            this.print_tree(node.block , depth + 1) 
        }
        else if (node.type == StatementType.ForIteration) {
            print(sep + "ForIteration")
            this.print_tree(node.var , depth + 1)                     
            this.print_tree(node.start , depth + 1)                     
            this.print_tree(node.end , depth + 1)                     
            this.print_tree(node.block , depth + 1)                     
        }
        else if (node.type == StatementType.FuncCall) {
            print(sep + "FuncCall")
            print(sep + node.name)
            for (let i = 0; i < node.args.length; i++) {
                this.print_tree(node.args[i],depth + 1)
            }            
        }
        else if (node.type == StatementType.FuncDeclaration) {
            print(sep + "FuncDeclaration")
            print(sep + node.name)
            print(sep + str(node.args))
            this.print_tree(node.body , depth + 1)  
        }
        else if (node.type == StatementType.TableLookup) {
            print(sep + "TableLookup")
            print(sep + `table: ${node.table}`)
            print(sep + `key: ${node.key}`)
        }
        else {
            print(`[Parser Error] Unexpected node to be printed '${node}'`)
            throw(`[Parser Error] Unexpected node to be printed '${node}'`)
        }
    }
}      


    

    

        

 
    
    

  
        
        
            

    

    

        


    
    
   
