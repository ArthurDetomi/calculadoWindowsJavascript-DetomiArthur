class CalculatorCcontroller{
    constructor()
    {
        //atributos
        this._operation = [];
        this._lastOperator = "";
        this._lastNumber = "";
        this._displayCalcEl = document.getElementById("display");
        this.initialize();
      
    }

    initialize()
    {
        this.initButtonsEvents();
    }
    //seters and geters
    get lastNumber()
    {
        return this._lastNumber;
    }

    set lastNumber(value)
    {
        this._lastNumber = value;
    }

    get lastOperator()
    {
        return this._lastOperator;
    }

    set lastOperator(value)
    {
        this._lastOperator = value;
    }

    get displayCalc()
    {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value)
    {
        this._displayCalcEl.innerHTML = value;
    }
    //metodos
    addEventListenerAll(el, events, fn)
    {
        events.split(" ").forEach(event=>{
            el.addEventListener(event, fn, false);
        })
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll(".container > .row > button");
        
        buttons.forEach((btn,index)=>{

            this.addEventListenerAll(btn, "click drag", e=>{

                this.executeButtons(btn.innerHTML);
                console.log(this._operation);

            });


            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{

                btn.style.cursor = "pointer";

            });

        });

    }

    executeButtons(btn)
    {
        if(["0","1","2","3","4","5","6","7","8","9"].indexOf(btn) > -1){

            if(!this.getLastTermOfArray()){

                this.displayCalc = btn;
                this.operationPush(btn);

            }else if(parseFloat(this.getLastTermOfArray()) > 0){

                this._operation[this._operation.length - 1] = this._operation[this._operation.length - 1] + btn;
                this.displayCalc = this._operation[this._operation.length - 1];

            }else{

                this.displayCalc = btn;
                this.operationPush(btn);

            }

        }else{

            switch(btn){
                case "+":
                    this.addBasicOperation(btn);
                break;

                case "-":
                    this.addBasicOperation(btn);
                break;

                case "X":
                    this.addBasicOperation("*");
                break;

                case "÷":
                    this.addBasicOperation("/");
                break;

                case "x²":
                    this.addEspecialOperation("**");
                break;

                case "√":
                    this.addEspecialOperation("raiz");
                break;

                case "¹/x":
                    this.addEspecialOperation("1/x");
                break;

                case "=":
                    this.calc();
                break;

                case "C":
                    this.clearAll();
                break;

                case "CE":
                    this.clearEntry();
                break
            }

        }
    }

    addBasicOperation(op)
    {

        if(["+","-","*","/"].indexOf(this.getLastTermOfArray()) > -1){

            this._operation[this._operation.length - 1] = op;

        }else{

            if(this._operation.length >= 3){
                this.calc();
            }
            this.operationPush(op);
        }

    }

    addEspecialOperation(operator)
    {
        if(operator == "**" || operator == "raiz" || operator == "1/x"){
            if(!isNaN(this.getLastTermOfArray())){
                if(operator == "**"){
                    
                    let op = parseFloat(this.getLastTermOfArray())**2;
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else if(operator == "raiz"){

                    let op = Math.sqrt(parseFloat(this.getLastTermOfArray()));
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else { // caso for 1/x

                    let op = 1 / parseFloat(this.getLastTermOfArray());
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }
            }
        }
    }

    calc()
    {
        if(this._operation.length == 1 && this.lastNumber != ""){

            this.operationPush(this.lastOperator);
            this.operationPush(this.lastNumber);

        }
        if(this._operation.length >= 3){
            let operator = this._operation.join("");
            console.log(operator);
            this.displayCalc = eval(operator);
            this.lastOperator = this._operation[this._operation.length - 2];
            this.lastNumber = this._operation[this._operation.length - 1];
            this._operation = [];
            this._operation.push(this.displayCalc);
        }
        
    }

    clearEntry()
    {
        if(this._operation.length <= 1){

            this.clearAll();

        }else if(this._operation.length >= 3){

            this._operation.pop();
            this.displayCalc = 0;

        }else{

            this.displayCalc = 0;

        }

    }

    clearAll()
    {
        this._operation = [];
        this.displayCalc = 0;
    }

    operationPush(value)
    {
        this._operation.push(value);
    }

    getLastTermOfArray()
    {
        return this._operation[this._operation.length - 1];
    }

    setLastTermOfArray(value)
    {
        this._operation[this._operation.length - 1] = value;
    }

    



}