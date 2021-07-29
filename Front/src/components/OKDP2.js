import React from 'react';
import {Component} from 'react';
import Numeral from "numeral";
import "numeral/locales/ru";

const GETOKDP2 = './GetOkdp2?feik=yes';

class OKDP2 extends Component {
constructor (props) {
  super(props);

  this.state = {
    okdp2FromServer:[],
    isLoading:true
   }	
 }

FetchRun (){
  this.setState({ isLoading: true });
  const {onlyKrista, actualTorg, odinS, typeForm}=this.state;
  var  query=GETOKDP2;
    console.log('Fetch RUN', query);

    return fetch(query , {
    
        method: 'GET',
        headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
        }
    })
    .then(response => { return response.json();})
    .then(responseData => this.setState({ 
      okdp2FromServer: responseData, 
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});})

    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
  
  console.log("fetch Ok",this.okdp2FromServer);
}

componentDidMount(){
  console.log("---","Did Mount OKDP2");
  this.FetchRun ();
}

componentWillMount()
{
 console.log("---","OKDP2 will MOUNT")

}

componentWillUpdate(){
  console.log("---","OKDP2 Will Update")
}

 render(){ 
 	var count=1;
 	const {okdp2FromServer, isLoading}=this.state;

	console.log('okdp2FromServer', okdp2FromServer);
  console.log('isLoading', isLoading);

  let form;
  if (!isLoading) {
	form  = okdp2FromServer.map (okdp => 
	<tr key={okdp.ID}>
      <th scope="row">{count++}</th>
      <td>{Numeral(okdp.ID).format("0")}</td>
      <td>{okdp.NAME}</td>
          </tr>
		)
}

return (
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Код</th>
      <th scope="col">Наименование</th>
    </tr>
  </thead>
  <tbody>
    {isLoading?<img class="img-circle mx-auto d-block" id="loadImg" src="img/ajax-loader1.gif" />:form}

  </tbody>
</table>
	)

 } 

}

export default OKDP2
