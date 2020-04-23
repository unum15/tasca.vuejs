class LogicNode{
    constructor(value){
        this.value='';
        this.right=null;
        this.left=null;
        this.valid=true;
        
        return this.parse(value);
    }
    
    parse(value){
        var space = /\s/g;
        for (var i = 0; i < value.length; i++) {
            if(this.value.test(space))
            this.value += value.charAt(i);
            
        }
    }
    
    evalLogic(){
        return true;
    }
    
}

export default LogicNode;

