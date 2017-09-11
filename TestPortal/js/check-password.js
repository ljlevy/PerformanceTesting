function CheckPassword(inputtxt) 
{ 
 var passw = "PASSWD_TO_DEFINE" ;
 // For instance: var passw = "nuxcmcwkit" ;
 
    localStorage.setItem('psswd_ok', "0");
 
  if(inputtxt.value.match(passw)) 
  { 
    alert('Correct !');
    localStorage.setItem('psswd_ok', "1");
    return true;
  }
  else
  { 
    alert('Wrong...!');
    localStorage.setItem('psswd_ok', "0");
    return false;
  }
}
 
