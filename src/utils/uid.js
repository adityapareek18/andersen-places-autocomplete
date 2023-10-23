export default function uid(wordLength = 4){
 return String.fromCharCode(97 + wordLength) + "_" + window.crypto.getRandomValues(new Uint32Array(wordLength)).join("_");
}
