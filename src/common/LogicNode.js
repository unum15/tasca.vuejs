class LogicNode{
    constructor(value, append_equals=false){
        this.value=null;
        this.right=null;
        this.left=null;
        value = value.toLowerCase().replace(/\s/,'');
        if((append_equals)&&(/^\d+$/.test(value))){
            value = '=' + value;
        }
        try{
            this.parse(value);
        }
        catch(e){
            console.log(e);
        }
    }
    
    parse(value){
        if(/^$/.test(value)){
            return;
        }
        if(/.+and.+/.test(value)){
            let values = /(.+)(and)(.+)/.exec(value); //replace with matchAll when avialable
            this.value = values[2];
            this.left = new LogicNode(values[1]);
            this.right = new LogicNode(values[3]);
            return;
        }
        if(/.+or.+/.test(value)){
            let values = /(.+)(or)(.+)/.exec(value); //replace with matchAll when avialable
            this.value = values[2];
            this.left = new LogicNode(values[1]);
            this.right = new LogicNode(values[3]);
            return;
        }
        if(value == 'value'){
            this.value = value;
            return;
        }
        if(/^\d+$/.test(value)){
            this.value = value;
            return;
        }
        if(/^\d+$/.test(value)){
            this.value = value;
            return;
        }
        if(/^[><=]+\d+$/.test(value)){
            let values = /([><=]+)(\d)/.exec(value); //replace with matchAll when avialable
            this.value = values[1];
            this.left = new LogicNode('value');
            this.right = new LogicNode(values[2]);
            return;
        }
        throw "Could not parse:'" + value + "'";
    }
    
    matches(value){
        switch(this.value){
            case null :
                return true;
            case 'value':
                return value;
            case '=':
                return this.left.matches(value) == this.right.matches(value);
            case '>=':
                return this.left.matches(value) >= this.right.matches(value);
            case '<=':
                return this.left.matches(value) <= this.right.matches(value);
            case '>':
                return this.left.matches(value) > this.right.matches(value);
            case '<':
                return this.left.matches(value) < this.right.matches(value);
            case 'or':
                return this.left.matches(value) || this.right.matches(value);
            case 'and':
                return this.left.matches(value) && this.right.matches(value);
        }
        return this.value;
    }
    
}

export default LogicNode;

