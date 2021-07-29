import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

export default ({ term, data, update }) => {

 const element = <FontAwesomeIcon icon={faSearch} size='lg'/>

 const dataSearch = () => {
//    console.log("Вызвалась dataSearch");
    const value = term;
//    console.log(term);
    update({
      term: value
    });
    
  };

 const NullFunc = e =>{
  const value = e.target.value.toLowerCase();
  term=value;
//  console.log(term);
};

  return (
    <div className="input-group input-group-lg">
      <div class="input-group-prepend">    
        <span class="input-group-text" id="basic-addon1">{element}</span>
      </div> 
      <input
        type="text"
        id="orgname"
        className="form-control form-control-lg"
        placeholder="Найти организацию по наименованию ...."
        onChange={NullFunc}
        onKeyPress={(e) => {
                           if (e.key==="Enter") 
//                            {console.log('Нажали ENTER'); 
//                           console.log("term=",term);
//                           alert ("Нажали долбаный ENTER");
                           dataSearch();
                           
                         }}
      />
      <div class="input-group-append">
       <button 
          className="btn btn-outline-success" 
          onClick={dataSearch}
          type="submit">НАЙТИ
        </button>      
      </div>  
    </div>

  );
  
};