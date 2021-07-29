import React from 'react';
import Article from './Article';
import Toolbar from './Toolbar';
import {Component} from 'react';
import Numeral from "numeral";
import "./zakupki.css";
import ExportCSV from './ExportCSV';


class ArticleList  extends Component  {
 
 constructor (props) {
  super(props);

  this.state = {
   data: [],
   articlesFromServer: [],
   term: '',
   active: 0,
   isLoading: false};

 }	

 FetchRun (){
  this.setState({ isLoading: true });
//  const GoogleUser=window.gapi.auth2.getAuthInstance().currentUser.get();
//  const {onlyKrista, ittortg, actualTorg, odinS, typeForm,inn, name,GoogleId}=this.state;
  const {onlyKrista, ittortg, actualTorg, odinS, typeForm,inn, name, GoogleId, googleEmail}=this.props;
  if (name==='') {return}
  var query="";
//  query="./WebApp/GetZakupki?feik=yes";
  query="./GetZakupki?feik=yes";  

  var onlyKristaString=onlyKrista?"&onlyKrista=yes":"";
  var actualTorgString=actualTorg?"&actualTorg=yes":"";
  var ittortgString=ittortg?"&ittortg=yes":"";
  var odinSString=odinS?"&odinS=yes":"";
  var innString="&inn="+inn;
  var GoogleIdString="&GoogleId="+GoogleId;
  var googleEmailString="&GoogleEmail="+googleEmail;

  console.log('Fetch RUN', query + onlyKristaString + actualTorgString + odinSString + ittortgString + innString+GoogleIdString+googleEmailString);

    return fetch(query + onlyKristaString + actualTorgString + odinSString + ittortgString + innString+GoogleIdString+googleEmailString, {
        method: 'GET',
        headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
        }
    })
    .then(response => { return response.json();})
    .then(responseData => this.setState({ 
      articlesFromServer: responseData,
      data: responseData,
      isLoading: false })
    )
    .then(data => {this.setState({"questions" : data});})

    .catch(err => {
        console.log("Attention fetch error: " + err);
    });
}

 
 updateData(config) {
  console.log('---', 'update Data ArticleList')	;
  this.setState(config);
  
}

componentDidUpdate(prevProps, prevState, snapshot) {
  console.log("---","ArticleList Did Update");

  const {onlyKrista,actualTorg,odinS,typeForm, ittortg, name}=this.props;
//  console.log("-odinS",odinS);
  console.log("prevState.onlyKrista",prevProps.onlyKrista);
  console.log("onlyKrista", onlyKrista);   

  if ((prevProps.onlyKrista!==onlyKrista) || 
    (prevProps.actualTorg!==actualTorg) || 
    (prevProps.typeForm!==typeForm) ||
     (prevProps.odinS!==odinS) ||
     (prevProps.name!==name)  ||
     (prevProps.ittortg!==ittortg)

     ) {
    this.FetchRun ();
  }


}

componentDidMount(){
  console.log("---","Did Mount ArticleList");
  const {name}=this.props;
 if (name!=="") {
  this.FetchRun ();
}

}


 render(){ 
  
 	const {data, articlesFromServer, isLoading}=this.state;
 	
    Numeral.localeData().delimiters.thousands = ' '; 	

	const articleElements = data.map (article => 
		<tr key={article.id}>
          <td><a href={article.TEXT} target="_blank" data-toggle="tooltip" data-placement="Посмотреть по ссылке на сайте" title="Ссылка на сайте">{article.TITLE}</a></td>
		  <td>{Numeral(article.MAXPRICE).format("0,0.00")}</td>
		  <td>{article.ORGNAME}</td>
		  <td>{article.PUBLISHDATE}</td>
		  <td>{article.REGNAME}</td>		  
      <td>{article.PLACINGWAY}/<span class="orange">{article.ZAKON}</span></td>

		</tr>)
return (
	<h4><Toolbar initialData={articlesFromServer} data={data} update={this.updateData.bind(this)}/>
	<table class="table table-striped table-bordered table-sm">
    <tr>
      <th scope="col">Объект закупки</th>
      <th scope="col">Начальная цена, руб</th>
      <th scope="col">Заказчик</th>
      <th scope="col">Дата публикации</th>
      <th scope="col">Регион</th>
      <th scope="col">Способ закупки</th>
    </tr>
	  {isLoading?<img class="img-circle mx-auto d-block" id="loadImg" src="img/ajax-loader1.gif" />:articleElements}
	</table>
          <div>
          <ExportCSV csvData={this.state.data} fileName={"export"} />
        </div>     
	</h4>
	)

}
}

export default ArticleList