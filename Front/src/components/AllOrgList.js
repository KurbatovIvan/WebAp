import React from 'react';
import {Component} from 'react';
import Numeral from "numeral";
import "numeral/locales/ru";
import Pagination from "./Pagination";
import Searchbar from "./Searchbar";
import micromatch from "micromatch";
import { Link } from './Router';
import ExportCSV from './ExportCSV';

const ADDMYORG = './Addmyorg?feik=yes&inn=';
const GETORG = './GetOrg?feik=yes';


class AllOrgList extends Component {
constructor (props) {
  super(props);
  this.state = {
    OrgFromServer:[],
    isLoading:true,
    offset:0,
    totalOrg:0,
    term:''
   }	
 }

updateData(config) {
  console.log("---","updateData Find ORG ok");
  const {term} = config;
  console.log("term",term);  
  this.setState(config);
}

FetchRunCount (){
  this.setState({ isLoading: true });
  var  query=`${GETORG}$&count=yes`;

    return fetch(query , {
        method: 'GET',
        headers: {
        "Accept": "text/plain",
        'Content-Type': 'text/plain'
        }
    })
    .then(response => { return response.text();})
    .then(responseData => this.setState({ 
      totalOrg: parseInt(responseData,10),
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});})
    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
}

FetchRun (){
  this.setState({ isLoading: true });
  var {offset,term}=this.state;
  if (offset<0) {offset=0;};  
  var query=`${GETORG}$&size=50&offset=`+offset;
  
  if (term!=='') {
    var  query=`${GETORG}$&nameorg=`+term;  
  }  

   fetch(query , {
//    return fetch(query , {
    
        method: 'GET',
        headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
        }
    })
    .then(response => { return response.json();})
    .then(responseData => this.setState({ 
      OrgFromServer: responseData, 
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});})

    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
  
  console.log("fetch Ok");
}

componentDidMount(){
  console.log("---","Did Mount AllOrgList");
  this.FetchRunCount();  
  this.FetchRun ();
}

componentDidUpdate(prevProps, prevState, snapshot) {
  console.log("---","Org list did Update");
  const {offset, term}=this.state;

  if ((prevState.offset!==offset) || (prevState.term!==term)) {
    this.FetchRun ();
  }

}



addmyorg (innOrg){
  this.setState({ isLoading: true });    
   const GoogleUser=window.gapi.auth2.getAuthInstance().currentUser.get();
   const query=ADDMYORG+innOrg+"&user_id="+GoogleUser.getId();

fetch(query , {
//    return fetch(query , {
    
        method: 'GET',
        headers: {
        "Accept": "text/plain",
        'Content-Type': 'text/plain'
        }
    })
    .then(response => { return response})
    .then(responseData => this.setState({ 
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});
                   })

    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
  
  console.log("fetch Ok");
  alert ("Организая добавлена в свои ИНН="+innOrg + " GID="+GoogleUser.getId());  

}

// Тут доделывать !
update (type, innOrg){
var {updateData, typeForm, inn}=this.props;
console.log ('innOrg:', innOrg);
updateData ({
  typeForm:type,
  inn: innOrg
 });
}


/**
 * Returns true if the given value is effectively an empty string
 */

isMyOrg(val) {
  return String(val) === '1' || String(val) === '2' ;
}


onPageChanged = data => {
    const { allCountries } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    console.log("pageLimit=",pageLimit);
    console.log("currentPage=",currentPage);
    console.log("offset=",offset);
    this.setState({ offset, totalPages });
};

 render(){ 
 	var count=1;

 	const {OrgFromServer, isLoading, offset, totalOrg}=this.state;	
//  if (totalOrg === 0) return (<div><img class="img-circle mx-auto d-block" id="loadImg" src="img/ajax-loader1.gif" /></div>); // Без этой строчки чет не работает


  let form;
  let pagination;  
// Показывает пагинацию только если количество организаций больше нуля  
  if (totalOrg>0) { 
    pagination = 
        <Pagination
         totalRecords={totalOrg}
         pageLimit={50}
         pageNeighbours={offset}
         onPageChanged={this.onPageChanged}
        />;  
  }  
  if (!isLoading) {
	form  = OrgFromServer.map (org => 
	<tr key={org.INN}>
      <th scope="row">{count++}</th>
      <td>{org.REGNUMBER}</td>      
      <td>{Numeral(org.INN).format("0")}</td>
      <td>{Numeral(org.KPP).format("0")}</td>
      <td>{Numeral(org.OGRN).format("0")}</td>
      <td>{org.EMAIL}</td>
      <td>{org.PHONE}</td>      
      <td>{org.NAME} 
    
		
      </td>
      <td>
        {this.isMyOrg(org.EXISTINMORG)?<button className="btn btn-warning btn-lg float-right disabled">Добавить в список моих организаций</button>:<button onClick={() => this.addmyorg(Numeral(org.INN).format("0"))}  className="btn btn-warning btn-lg float-right">Добавить в список моих организаций</button>}
        <Link to={"/WebApp/Torg"}>
          <button onClick={() => this.update('Torg',Numeral(org.INN).format("0"))} className="btn btn-success btn-lg float-right">Все торги у клиента</button> 
        </Link>          
      </td>
     </tr>
		)
  }
return (
<div> 
  <div className="d-flex flex-row">
          
     <div className="p-2">
         {pagination}
      </div>

      <div className="input-group mb-3">
          <Searchbar
            term={this.state.term}
            data={this.OrgFromServer}
            update={this.updateData.bind(this)}
          />
      </div>
        <div className="col-md-4 center">
          <ExportCSV csvData={this.state.OrgFromServer} fileName={"export"} />
        </div>
      </div>
<h4>      
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">ИКО(УИД)</th>
      <th scope="col">ИНН</th>
      <th scope="col">КПП</th>
      <th scope="col">ОГРН</th>
      <th scope="col">Email</th>
      <th scope="col">Телефон</th>      
      <th scope="col">Наименование</th>
      <th scope="col">Действия</th>      
    </tr>
  </thead>
  <tbody>
     {isLoading?<img class="img-circle mx-auto d-block" id="loadImg" src="img/ajax-loader1.gif" />:form}
  </tbody>
</table>
</h4>
</div>
	)

 } 

}

export default AllOrgList
