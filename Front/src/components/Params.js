import React from 'react';
import {Component} from 'react';
import Modal from './Modal'

class Params extends Component {
 
 constructor (props) {
 super(props)
 this.state = {isOpen:true,
  activeTorg:true,
  activeOrg:false
 	}

 }

update (type) {
// Тут доделать
 var {onlyKrista, actualTorg, odinS, query, updateData, typeForm}=this.props;
 var {activeTorg,activeOrg}=this.state;
 console.log('odinS Before', odinS);
 if (type=="onlyKrista") { onlyKrista=!onlyKrista; if (onlyKrista==true){odinS=false;}} else
 if (type=="actualTorg") { actualTorg=!actualTorg;} else
 if (type=="odinS") { odinS=!odinS; if (odinS==true){onlyKrista=false;} } else
 typeForm=type;
 if (type=="Torg") {activeTorg=true;activeOrg=false;}
 if (type=="Org") {activeTorg=false;activeOrg=true;}
 console.log('odinS After', odinS);
 this.setState(
 {
  activeTorg:activeTorg,
  activeOrg:activeOrg
 }
  );

 
 updateData ({
  onlyKrista:onlyKrista,
  actualTorg:actualTorg,
  odinS:odinS
 });

}
/*
handleClick = () => {
 console.log('---', 'clicked onlyKrista')
 this.setState(
  {
   onlyKrista: !this.state.onlyKrista
   }  
  )
}*/

 render(){
  const {isOpen, onlyKrista, actualTorg, odinS}=this.props;

 	return(


        <Modal show={isOpen}                            
          onClose={this.update}>

<div class="list-group">
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary" onClick={() => this.update('onlyKrista')}>Показать {!onlyKrista ? 'торги ТОЛЬКО у НАШИХ ': ' у всех '} Заказчиков</a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary" onClick={() => this.update('actualTorg')}>Показать {actualTorg ? ' Все торги, в том числе прошедшие ': ' Только актуальные '} на дату</a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary">Торги по Кристе</a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary"  onClick={() => this.update('odinS')}>Показать {!odinS ? ' Торги по 1С': ' все торги '} </a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary">Торги у Заказчика с ИНН</a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary">Торги по ОКПД</a>
    <a href="#" class="list-group-item list-group-item-action list-group-item-primary">Еще что то</a>
  </div>
  </Modal>

	



  )

 }

}

export default Params