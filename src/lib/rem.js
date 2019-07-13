const baseSize=10
function setRem(){
    const scale = document.documentElement.clientWidth/750
    document.documentElement.style.fontSize = (baseSize*scale) + "px"
}
window.onresize=function(){
    setRem()
}
   


