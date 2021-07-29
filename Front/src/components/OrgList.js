import React from 'react';
import {Component} from 'react';
import Numeral from "numeral";
import "numeral/locales/ru";
import Pagination from "./Pagination";
import Searchbar from "./Searchbar";
import { Link } from './Router'

const REMOVEMYORG = './Removemyorg?feik=yes&inn=';

class OrgList extends Component {
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

FetchRunCount (){
  this.setState({ isLoading: true });
  const {GoogleId}=this.props;  
  var  query="./GetMyOrg?feik=yes&count=yes"+"&user_id="+GoogleId;

    return fetch(query , {
        method: 'GET',
        headers: {
        "Accept": "text/plain",
        'Content-Type': 'text/plain'
        }
    })
    .then(response => { return response.text();})
    .then(responseData => this.setState({ 
      totalOrg: parseInt(responseData,10)
      , isLoading: false 
      })
    )
    .then(data => {this.setState({"questions" : data});})
    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
}

FetchRun (){
  this.setState({ isLoading: true });
//  const GoogleUser=window.gapi.auth2.getAuthInstance().currentUser.get();  
  var {offset, term}=this.state;
  console.log("offset BEFORE",offset);  
//  if (offset<=0) {return};
  console.log("offset AFTER",offset);  

  const {GoogleId}=this.props;

//  var  query="./GetMyOrg?feik=yes&size=50&offset="+offset+"&user_id="+GoogleUser.getId();
  var  query="./GetMyOrg?feik=yes&size=50&offset="+offset+"&user_id="+GoogleId;
  if (term!=='') {
     query="./GetMyOrg?feik=yes&nameorg="+term+"&user_id="+GoogleId;
  }
  console.log("query=",query);
    return fetch(query , {
        method: 'GET',
        headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
        }
    })
    .then(response => { return response.json();})
    .then(responseData => this.setState({ 
      OrgFromServer: responseData
      , isLoading: false 
    })
    )
    .then(data => {this.setState({"questions" : data});})
    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
}

componentDidMount(){
  console.log("---","Did Mount OrgList");
  this.FetchRunCount();
  this.FetchRun ();
}


componentDidUpdate(prevProps, prevState, snapshot) {
  const {offset, term, isLoading}=this.state;
  console.log("---","Org list did Update");
  console.log("isLoading=",isLoading);
  console.log("offset=",offset);  
  console.log("prevState.offset=",prevState.offset);    

  if ((prevState.offset!==offset) || (prevState.term!==term)) {
    this.FetchRun ();
  }

}

updateData(config) {
  console.log("---","updateData Find ORG ok");
  const {term} = config;
  console.log("term",term);  
  this.setState(config);
}

// Тут доделывать ! Выбирает торги по ИНН
update (type, innOrg){
var {updateData, typeForm, inn}=this.props;
console.log ('innOrg:', innOrg);
updateData ({
  typeForm:type,
  inn: innOrg
 });
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

delyorg (innOrg){
  this.setState({ isLoading: true });  
   const GoogleUser=window.gapi.auth2.getAuthInstance().currentUser.get();
   const query=REMOVEMYORG+innOrg+"&user_id="+GoogleUser.getId();
   const {OrgFromServer}=this.state; 

   fetch(query , {
        method: 'GET',
        headers: {
        "Accept": "text/plain",
        'Content-Type': 'text/plain'
        }
    })
    .then(response => { return response;})
    .then(responseData => this.setState({ 
      OrgFromServer:OrgFromServer.filter(org => org.INN != innOrg),
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});})

    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
  
  console.log("fetch Ok");
}

render(){ 
  var {OrgFromServer, isLoading, offset, totalOrg}=this.state; 
  console.log("isLoading RENDER=",isLoading);
  console.log("totalOrg=",totalOrg);  
  
//  if (totalOrg === 0) return (<div><img class="img-circle mx-auto d-block" id="loadImg" src="./img/ajax-loader1.gif" /></div>); // Без этой строчки чет не работает

  var count=1;
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
	  <tr key={org.REGNUMBER}>
      <th scope="row">{count++}</th>
      <td>{org.REGNUMBER}</td>
      <td>{Numeral(org.INN).format("0")}</td>
      <td>{org.EMAIL}</td>
      <td>{org.PHONE}</td>
      <td>{org.FULLNAME}
         <button onClick={() => this.delyorg(Numeral(org.INN).format("0"))}  className="btn btn-warning btn-lg float-right">Убрать из моих организаций</button>
          <Link to={"/WebApp/Torg"}>
           <button onClick={() => this.update('Torg', Numeral(org.INN).format("0"))} className="btn btn-success btn-sm float-right">Все торги у клиента</button> 
          </Link>
      </td>
    </tr>
		)
  }
return (
<div>
<h4> 
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

  </div>


<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">ИКО(УИД)</th>
      <th scope="col">ИНН</th>
      <th scope="col">Email</th>
      <th scope="col">Телефон</th>
      <th scope="col">Полное наименование</th>
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

export default OrgList
