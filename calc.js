const keys = document.querySelectorAll('.key')
const display_input = document.querySelector('.display .input')
const display_output = document.querySelector('.display .output')











let input = '';
let lastEvaluated=false;


function updateFontSize() {
  const number = display_input.textContent;
  if (number.length >= 6) {
    display_input.style.fontSize = '16px'; // Decrease font size
  } else {
    display_input.style.fontSize = '24px'; // Reset font size
  }
}

display_input.addEventListener('input', updateFontSize);




const isOperator = (value)=>{
  return ['/','+','-','%','*'].includes(value)
}





for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener('click', () => {
    if(lastEvaluated){  //REPLACES THE OUTPUT WITH NEW INPUT.
      input = ''
      display_input.innerHTML = ''
      display_output.innerHTML = ''
      lastEvaluated = false;
      display_output.style.transition = '';
      display_output.style.translate = '';
      display_input.style.transition=''
      display_input.style.translate='';
      display_input.style.opacity = 1;
    }


   if (value == "clear") { //CLEARS THE INPUT VALUE.
      input = '';
      display_input.innerHTML = '';
      display_output.innerHTML = '';
    }
    else if (value == "backspace") {
      input = input.slice(0, -1); //REMOVES LAST NUMBER FROM THE VALUE.
      display_input.innerHTML = cleanInput(input)

    }
    else if (value == "=") {
      display_output.style.transition = '';
      display_output.style.translate = '';
      let result = eval(prepareInput(input));//EVALUATES THE VALUES.
        
      display_output.innerHTML = cleanOutput(result)
      input = ''
      lastEvaluated = true //REPLACES THE OUTPUT WITH NEW INPUT.

      display_output.style.transition='0.5s'
      display_output.style.translate=('0% -110%')
      display_input.style.transition='0.5s'
      display_input.style.translate=('0% -200%')
      display_input.style.opacity = 0

      // if(value =="="){ //ERASES THE INPUT AFTER EVALUATION.
      //   input="";
      //   display_input.innerHTML = "";
      // }
      

    }

    else if (isOperator(value)) {
      if (input && isOperator(input[input.length - 1])) {
        // Replace the last operator symbol with the new one
        input = input.slice(0, -1) + value;
      } else {
        input += value;
      }
      display_input.innerHTML = cleanInput(input);
    }



    else if (value == "brackets") {
      if (input.indexOf('(') == -1 || //CHECKS IF THE "(" IS NOT THERE IN THE RESULT
        input.indexOf('(') != -1 && // CHECKS IF THERES IS "(" PESENT IN THE RESULT
        input.indexOf(')') != -1 && // CHECKS IF THERE IS ")" PRESENT IN THE RESULT
        input.lastIndexOf('(') < input.lastIndexOf(')')) { // CHECKS IF THE "(" IS PRESENT BEFORE THE ")" IN THE RESULT
        input += '(';
      }
      else if (
        input.indexOf("(") != -1 && //CHECKS IF THERE IS "(" PRESENT IN THE RESULT
        input.indexOf(")") == -1 || //CHECKS IF THEERE IS ")" NOT PRESENT IN THE RESULT
        input.indexOf("(") != -1 && //CHECKS IF THERE IS "(" PRESENT IN THE RESULT
        input.indexOf(")") != -1 && //CHECKS IF THERE IS ")" PRESENT IN THE RESULT
        input.lastIndexOf("(") > input.lastIndexOf(")") //CHECKS IF THE "(" COMES AFTER THE ")" IN THE RESULT
      ) {
        input += ")";
      }
      display_input.innerHTML = cleanInput(input)

    }



     


  
    else {
      if (validateInput(value)) {

        input += value;
        display_input.innerHTML = cleanInput(input)
      }
    }

  })
}






function cleanInput(input) {
  let input_array = input.split("");
  let input_array_length = input_array.length;

  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] == "*") {
      input_array[i] = `<span class='operator'>x</span>`
    }
   else if (input_array[i] == "/") {
      input_array[i] = `<span class='operator'>÷</span>`
    }
   else if (input_array[i] == "-") {
      input_array[i] = `<span class='operator'>-</span>`
    }
   else if (input_array[i] == "+") {
      input_array[i] = `<span class='operator'>+</span>`
    }
   else if (input_array[i] == "(") {
      input_array[i] = `<span class='operator'>(</span>`
    }
   else if (input_array[i] == ")") {
      input_array[i] = `<span class='operator'>)</span>`
    }
   else if (input_array[i] == "%") {
      input_array[i] = `<span class='operator'>%</span>`
    }
  }
  return input_array.join("")
}


function cleanOutput(output) {
  let output_string = output.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];

  let output_array = output_string.split("");

  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0; i -= 3) {
      output_array.splice(i, 0, ',')
    }
  }

  if (decimal) {
    output_array.push('.');
    output_array.push(decimal);
  }
  return output_array.join("")
}


function validateInput(value) {
  let last_input = input.slice(-1);
  let operators = ["%", "-", "*", "+", "/"];


  if (value == "." && last_input == ".") {
    return false
  }

  if (operators.includes(value)) {
    if (operators.includes(last_input)) {
      return false
    }
    else {
      return true
    }
  }

  return true
}

function prepareInput(input) {
  let input_array = input.split("")

  for (i = 0; i < input_array.length; i++) {
    if (input_array[i] == "%") {
      input_array[i] = "/100";

    }
  }
  return input_array.join("")
}


if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").then(registration =>{
    console.log("SW Registered!"); 
    console.log(registration); 
  }).catch(error =>{
    console.log("SW Registration Failed!");
    console.log(error);  
  })
}










