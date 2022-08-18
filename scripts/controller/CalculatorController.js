class CalculatorCcontroller{
    constructor()
    {
        //atributos
        this._audio = new Audio("click.mp3");
        this._audioOnOff = false;
        this._operation = [];
        this._lastOperator = "";
        this._lastNumber = "";
        this._displayHistoryOperation = document.getElementById("operation");
        this._displayCalcEl = document.getElementById("display");
        this.initialize();
      
    }

    initialize() //inicializa os metodos assim que se inicia
    {
        this.initButtonsEvents(); //inicia os eventos dos botões
        this.initKeyboard();
        this.pasteFromDisplayCalc();
        document.querySelectorAll("#btn-ce").forEach(btn=>{ //ativa o evento de ligar e desligar som
            btn.addEventListener("dblclick", e=>{
                this.toggleAudio();
            });
        });
    }
    //metodos de audio
    toggleAudio()
    {
        this._audioOnOff = (this._audioOnOff) ? false:true;
    }

    playAudio()
    {
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    //seters and geters
    get historyOperation()
    {
        return this._displayHistoryOperation.innerHTML;
    }

    set historyOperation(value)
    {
        this._displayHistoryOperation.innerHTML = value;
    }

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
        let aux = value.toString().replace(".",",");
        if(value.toString().length > 11 ){ //verifica se o valor da conta ultrapassou 11 digitos
            
            this.setError();
            return false;

        }else{

            this._displayCalcEl.innerHTML = aux;

        }
    }
    //metodos
    addEventListenerAll(el, events, fn) //adiciona varios eventos a um elemento
    {
        events.split(" ").forEach(event=>{
            el.addEventListener(event, fn, false);
        })
    }

    initButtonsEvents(){ //inicia eventos dos botões
        let buttons = document.querySelectorAll(".container > .row > button");
        
        buttons.forEach((btn,index)=>{

            this.addEventListenerAll(btn, "click drag", e=>{

                this.executeButtons(btn.innerHTML);
                console.log(this._operation);
                this.createhistoryOperation();

            });


            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{

                btn.style.cursor = "pointer";

            });

        });

    }

    executeButtons(btn)
    {
        this.playAudio();
        if(["0","1","2","3","4","5","6","7","8","9"].indexOf(btn) > -1){
            if(this.displayCalc.length < 11 || this.displayCalc == "0" || this.displayCalc == 0){

                if(!this.getLastTermOfArray()){

                    this.displayCalc = btn;
                    this.operationPush(btn);

                }else if(parseFloat(this.getLastTermOfArray()) > 0 || this.verifyDot()){

                    this._operation[this._operation.length - 1] = this._operation[this._operation.length - 1] + btn;
                    this.displayCalc = this._operation[this._operation.length - 1];

                }else{

                    this.displayCalc = btn;
                    this.operationPush(btn);

                }
            }

        }else{
            switch(btn){
                case "+":
                case "-":
                    if(this.verifyDisplayCalc()) this.addBasicOperation(btn);
                break;

                case "X":
                    if(this.verifyDisplayCalc()) this.addBasicOperation("*");
                break;

                case "÷":   
                    if(this.verifyDisplayCalc()) this.addBasicOperation("/");
                break;

                case "x²":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("**");
                break;

                case "√":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("raiz");
                break;

                case "¹/x":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("1/x");
                break;

                case "±":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("±");
                break;

                case "%":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("%");
                break;

                case "=":
                    if(this.verifyDisplayCalc()) this.calc();
                break;

                case "←":
                    if(this.verifyDisplayCalc()) this.execBackspace();
                break;

                case ",":
                    this.addDot();
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

    verifyDisplayCalc()
    {
        if(!this.getLastTermOfArray() ||  !this.displayCalc){

            return false;

        }else{

            return true;
        
        }
    }

    addBasicOperation(op)
    {
        if(["+","-","*","/"].indexOf(this.getLastTermOfArray()) > -1 && this.verifyDisplayCalc()){

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
        if(["**","raiz","1/x","±","%"].indexOf(operator) > -1){ //verifica se o operador é um desses
            if(!isNaN(this.getLastTermOfArray())){ //verifica se o ultimo termo do array é um numero
                if(operator == "**"){ //eleva ao quadrado
                    
                    let op = parseFloat(this.getLastTermOfArray())**2;
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else if(operator == "raiz"){ //raiz quadrada

                    let op = Math.sqrt(parseFloat(this.getLastTermOfArray()));
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else if(operator == "1/x"){ // caso for 1/x

                    let op = 1 / parseFloat(this.getLastTermOfArray());
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else if(operator == "±" && this.getLastTermOfArray() != "0"){ //muda de + para -

                    let op = parseFloat(this.getLastTermOfArray()) * -1;
                    this.setLastTermOfArray(op);
                    this.displayCalc = this.getLastTermOfArray();

                }else if(operator == "%"){

                    if(this._operation.length >= 2){ //verifica o tamanho da operação >= 2 

                        let op = parseFloat(this._operation[0]) * (parseFloat(this.getLastTermOfArray()) / 100);
                        this.setLastTermOfArray(op);
                        this.displayCalc = op;

                    }else{ //se for tamanho 1

                        this.operationPop();
                        this.displayCalc = "0";

                    }

                }
            }else{ //é um sinal o ultimo termo

                if(operator == "**"){ //eleva ao quadrado
                    
                    let op = parseFloat(this._operation[0]) ** 2;
                    this.operationPush(op);
                    this.displayCalc = op;

                }else if(operator == "raiz"){ //raiz quadrada

                    let op = Math.sqrt(parseFloat(this._operation[0]));
                    this.operationPush(op);
                    this.displayCalc = op;

                }else if(operator == "1/x"){ // caso for 1/x

                    let op = 1 / parseFloat(this._operation[0]);
                    this.operationPush(op);
                    this.displayCalc = op;

                }else if(operator == "±"){ //muda de +/- ou -/+

                    let op = parseFloat(this._operation[0]) * -1;
                    this.operationPush(op);
                    this.displayCalc = op;

                }else if(operator == "%"){ //caso for %

                    let op = parseFloat(this._operation[0]) * (parseFloat(this._operation[0]) / 100);
                    this.operationPush(op);
                    this.displayCalc = op;

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
            this.historyOperation += "="; //adiciona um = no historico

            let operator = this._operation.join("");
            let aux = operator.toString().replaceAll(",",".");
            console.log(aux);
            this.displayCalc = eval(aux);
            this.lastOperator = this._operation[this._operation.length - 2];
            this.lastNumber = this._operation[this._operation.length - 1];
            this._operation = [];
            this.operationPush(this.displayCalc);
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
        this.displayCalc = "0";
        this.createhistoryOperation(false);
    }

    execBackspace()
    {

        if(!isNaN(this.getLastTermOfArray()) || this.verifyDot()){ //tem que ser um numero

            if(this.getLastTermOfArray().length == 1){

                this.operationPop();
                this.displayCalc = "0";

            }else{

                let newValue = this.getLastTermOfArray().split("");
                newValue.pop();
                newValue = newValue.join("");
                this.setLastTermOfArray(newValue);
                this.displayCalc = newValue;
                

            }

        }

    }

    addDot()
    {
        let comparation = "";
        if(this.displayCalc != 0 || this.displayCalc != "0") comparation = this.displayCalc.split("");
        if(isNaN(this.getLastTermOfArray()) || !this.getLastTermOfArray()){
            
            this.operationPush("0.");
            this.displayCalc = "0,";
            
        }else if(comparation || comparation.indexOf(",") < 0 || comparation.indexOf(".") < 0){//se for um numero e já estiver definido e se a virgula já não existe

            let currentValue = this.getLastTermOfArray().toString();
            currentValue += ",";
            this.operationPop();
            this.operationPush(currentValue);
            this.displayCalc = currentValue;

        }
    }

    verifyDot()
    {
        let aux = "";
        if(this.getLastTermOfArray()){

            aux = this.getLastTermOfArray().split("");
            if(aux.indexOf(",") > -1 || aux.indexOf(".") > -1){

                return true;

            }else{

                return false;

            }

        }else{

            return false;
        }
    }

    createhistoryOperation(notClear = true)
    {
        if(notClear){
            let auxText = "";
            if(this._operation.length >= 2){
                this.historyOperation = "";

                auxText = this._operation.join("");
                auxText = auxText.replaceAll(".",",");
                auxText = auxText.replaceAll("*","x");
                auxText = auxText.replaceAll("/","÷");
                this.historyOperation = auxText;

            }
        }else{ //limpar tudo

            this.historyOperation = "";

        }
    }

    initKeyboard()
    {
        document.addEventListener("keyup", e=>{
            this.playAudio();
            if(["0","1","2","3","4","5","6","7","8","9"].indexOf(e.key) > -1){

                this.executeButtons(e.key);

            }

            switch(e.key){
                case "+":
                case "-":
                    if(this.verifyDisplayCalc()) this.addBasicOperation(e.key);
                break;

                case "*":
                    if(this.verifyDisplayCalc()) this.addBasicOperation("*");
                break;

                case "/":   
                    if(this.verifyDisplayCalc()) this.addBasicOperation("/");
                break;

                case "%":
                    if(this.verifyDisplayCalc()) this.addEspecialOperation("%");
                break;

                case "Enter":
                case "=":
                    if(this.verifyDisplayCalc()) this.calc();
                break;

                case "Backspace":
                    if(this.verifyDisplayCalc()) this.execBackspace();
                break;

                case ",":
                    this.addDot();
                break;

                case "Escape":
                    this.clearAll();
                break;

                case "Delete":
                    this.clearEntry();
                break

                case "c":
                if(e.ctrlKey) this.copyResultOperation();
                break;
            }
            this.createhistoryOperation();
        });

    }

    operationPush(value)
    {
        this._operation.push(value);
        this.createhistoryOperation();
    }

    operationPop()
    {
        this._operation.pop();
    }

    getLastTermOfArray()
    {
        return this._operation[this._operation.length - 1];
    }

    setLastTermOfArray(value)
    {
        this._operation[this._operation.length - 1] = value;
    }

    setError()
    {
        this.displayCalc = "ERROR";
    }

    pasteFromDisplayCalc()
    {
        document.addEventListener("paste",e=>{
            let text = e.clipboardData.getData("Text");
            text = text.toString().replace(",",".");
            if(!isNaN(text)){ //verifica se é um numero que está sendo colado

                this.operationPush(text);
                this.displayCalc = text;
                
            }
        });
    }

    copyResultOperation()
    {
        navigator.clipboard.writeText(this.displayCalc); //copia o valor atual da calculadora
    }

}