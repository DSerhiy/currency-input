class CurrencyInput {
	constructor(inputEl) {
		this.data = inputEl.value;
		this.__inputEl = inputEl;
		this.__dataInputEl = document.createElement('input');
		this.__init();
	}

	__init() {
		this.__dataInputEl.setAttribute('type', 'hidden');
		this.__dataInputEl.value = this.data;
		this.__dataInputEl.name = this.__inputEl.name;
		this.__dataInputEl.id = this.__inputEl.id;
		
		this.__inputEl.removeAttribute('name');
		this.__inputEl.removeAttribute('id');

    this.__inputEl.parentElement.insertBefore(this.__dataInputEl, this.__inputEl);

    this.__formatCurrency('blur');
    
    this.__inputEl.addEventListener('keyup', (e)=> {
      this.__formatCurrency(e.type)      
    });

    this.__inputEl.addEventListener('blur', (e)=> {      
      this.__formatCurrency(e.type)
      this.__dataInputEl.value = +this.__inputEl.value.replace(/,/g, '');
    });    
	}

  __formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  __formatCurrency(blur) {
    // validates decimal side
    // and puts cursor back in right position.  
    
    // get input value
    let input_val = this.__inputEl.value;
    
    // don't validate empty input
    if (input_val === "") { return; }
    
    // original length
    const original_len = input_val.length;

    // initial caret position 
    let caret_pos = this.__inputEl["selectionStart"];
        
    // check for decimal
    if (input_val.indexOf(".") >= 0) {

      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      const decimal_pos = input_val.indexOf(".");

      // split number by decimal point
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.__formatNumber(left_side);

      // validate right side
      right_side = this.__formatNumber(right_side);
      
      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00";
      }
      
      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = left_side + "." + right_side;

    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.__formatNumber(input_val);
      input_val = input_val;
      
      // final formatting
      if (blur === "blur") {
        input_val += ".00";
      }
    }
    
    // send updated string to input
    this.__inputEl.value = input_val;

    // put caret back in the right position
    const updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    this.__inputEl.setSelectionRange(caret_pos, caret_pos);
  }  
}

class CurrencyInputManager {
	constructor() {
		this.currencyInputList = [];
		this.__init();
	}

	__init() {
		const inputEls = document.querySelectorAll('input[data-role="currency"]');

		inputEls.forEach(inputEl => {
			this.currencyInputList.push(new CurrencyInput(inputEl));
		});
	}
}

new CurrencyInputManager();