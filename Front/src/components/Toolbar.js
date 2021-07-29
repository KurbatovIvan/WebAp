import React, { Component } from 'react';


export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.sorted = 
    { PLACINGWAY: false, 
      TITLE: false,
      MAXPRICE: false };
  }



  sort(type) {
    console.log('sort by', type);
  // с помощью реструктуризации создаём две переменные
    const { update, data } = this.props;
  // получаем порядок сортировки
    const isSorted = this.sorted[type];
  // устанавливаем направление
    let direction = isSorted ? 1 : -1;
    console.log('direction', direction);
    console.log('Data before sort: ', data);

// создаём новый массив из данных, чтобы не перезаписывать 
  // состояние и сортируем его
  var sorted = [];
//  Сортируем double
  if (type=="MAXPRICE") {
     console.log('MAXPRICE', ' = YES !');
     sorted = [].slice.call(data).sort((a, b) => {
    return (a[type] - b[type])*direction;
  });
  } else 
{  
  sorted = [].slice.call(data).sort((a, b) => {
    // чтобы сортировка всегда была одинаковой учтём все условия
    // функция может вернуть 0, 1 или -1, в зависимости от возвращаемого
    // значения метод массивов sort сделает свой выбор
    if (a[type] === b[type]) { return 0; }
    return a[type] > b[type] ? direction : direction * -1;
  });
 }

  // меняем порядок сортировки
  this.sorted[type] = !isSorted;

  // обновляем состояние
  update({
    data: sorted,
    active: 0
  });
  console.log('Data after sort: ', sorted);
  }
  reset() {
    this.props.update({
    data: this.props.initialData,
    term: '',
    active: 0
  });
  }

  render() {

    return (
      <div className="toolbar">
        <button className="btn btn-default" onClick={() => this.sort('TITLE')}>
        <span class="glyphicon glyphicon-sort-by-attributes"></span>
          <i className="fa fa-sort-alpha-asc"></i>  По заголовку
        </button>
        <button className="btn btn-default" onClick={() => this.sort('PLACINGWAY')}>
          <i className="fa fa-sort-numeric-desc"></i>  По способу размещения
        </button>
        <button className="btn btn-default" onClick={() => this.sort('MAXPRICE')}>
          <i className="fa fa-sort-numeric-desc"></i>  По НМЦК
        </button>
        <button className="btn btn-default" onClick={() => this.sort('ADATE')}>
          <i className="fa fa-sort-numeric-desc"></i>  По дате
        </button>        
        <button className="btn btn-danger" onClick={this.reset.bind(this)}>
          <i className="fa fa-ban"></i>  Сбросить
        </button>
      </div>
    );
  }
}