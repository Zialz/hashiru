import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'react-router-dom'
import source from '../json/source.json';
import "./Holder.css";

const Holder = (props) => {
     //stuffs

     const [redirect, setRedirect] = useState(false);
     const [data, setData] = useState();
     const [keyword, setKeyword] = useState();
 
     const handleSubmit = e => {
         e.preventDefault();
         props.history.push({
             pathname: '/graph',
             state:
             {
                 test:fileData
             }
         })
     }

      /**
   * UPLOAD PART
   * 
   */
  var cat = '';
  const [call, setCall] = useState(false);
  const [fileData, setfileData] = useState(1);
  const showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader()
      var textFromFileLoaded;

      reader.onload = function (fileLoadedEvent) {
        textFromFileLoaded = fileLoadedEvent.target.result;
        console.log("1:", textFromFileLoaded)
        storeResults(textFromFileLoaded);

      };

      reader.readAsText(file, "UTF-8");

    } else {
      alert("Your browser is too old to support HTML5 File API");
    }
  }


  function storeResults(result) {
    cat = result;
    var convert = require('xml-js');
    var result1 = convert.xml2json(cat, { compact: true, ignoreDeclaration: true, instructionHasAttributes: false, spaces: 4 });

    setfileData(result1);
  }

 
     return (
         <div className="container py-5">
             <div class="card bg-white">
            <h5 className="card-header">Importer votre propre parcours</h5>
            <div class="card-body p-3">
            <input type="file" onChange={showFile} className="form-control-file m-1"/>
            <form onSubmit={handleSubmit}>
             <input type="submit" value="Envoyer" className="btn btn-outline-danger m-1" />
             </form>
            </div>

          </div>
         </div>
     )
 }

export default Holder;