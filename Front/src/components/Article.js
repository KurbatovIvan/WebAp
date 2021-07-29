import React from 'react';
import {Component} from 'react';
import Numeral from "numeral";
import "numeral/locales/ru";

class Article extends Component {
 constructor (props) {
 super(props)
 this.state = {isOpen:false}

 }

updateData(config) {
  console.log('---', 'update Data') 
  this.setState(config);
}

 render(){
	const {article}=this.props
	console.log('Aricle props', this.props)
	console.log('article', article)
  const isHide=true;
  // switch between locales
//  Numeral.locale('ru');
   Numeral.localeData().delimiters.thousands = ' ';

	const body=this.state.isOpen && 
  <section>
   <h3>Способ размещения: {article.PLACINGWAY}</h3>
   <h3><a href={article.TEXT} target="_blank" data-toggle="tooltip" data-placement="Посмотреть по ссылке на сайте" title="Посмотреть по ссылке на сайте">{article.TEXT}</a></h3>
   <h3>Начальная максимальная цена:{Numeral(article.MAXPRICE).format("0,0.00")}</h3>
   <h3>Размещение осуществляет: {article.RESPONSIBLEORG_FULLNAME}</h3>
   <h3>ИНН Заказчика: {article.INN_ZAK}</h3>  
   <h3>Дата публикации: {article.PUBLISHDATE}</h3>   
   <h3>Дата создания: {article.ADATE}</h3>
   <h3>Дата окончания: {article.ENDDATE}</h3>
          <button onClick={this.handleClickHide} className="btn btn-success btn-sm float-right">
          {this.state.isHide ? 'Не наши торги': 'Наши торги'}</button>   
  </section>;

    return (
	<div className="card">
          <h2 className="card-header">{article.TITLE}

          <button onClick={this.handleClick} className="btn btn-primary btn-lg float-right">
          {this.state.isOpen ? 'Свернуть': 'Подробности'}</button>
        </h2>
	       <div className="card-body">
          {body} 
          </div>     
      </div>
        
)



 }

handleClick = () => {
 console.log('---', 'clicked')
 this.setState(
  {
   isOpen: !this.state.isOpen
   }  
  )
}

handleClickHide = () => {
 console.log('---', 'clicked Hide')
 
}


}




export default Article