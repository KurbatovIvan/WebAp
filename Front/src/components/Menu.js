import React from 'react';
import {Component} from 'react';
import LinkBtn from './LinkBtn';
import { Link } from './Router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFilter} from '@fortawesome/free-solid-svg-icons';

const element = <FontAwesomeIcon icon={faFilter} size='lg'/>;


class Menu extends Component {


constructor (props) {
  super(props);

  this.state = {
    activeTorg:true,
    activeOrg:false,
    activeOkdp2:false,
    activeAllOrg:false,
 	}
  }	


update (type) {
 var {updateData, typeForm}=this.props;
 var {activeTorg,activeOrg,activeOkdp2,activeAllOrg}=this.state;
 if (type=="Torg") {activeTorg=true;activeOrg=false;activeOkdp2=false;activeAllOrg=false;}
 if (type=="Org") {activeTorg=false;activeOrg=true;activeOkdp2=false;activeAllOrg=false;}
 if (type=="Okdp2") {activeTorg=false;activeOrg=false;activeOkdp2=true;activeAllOrg=false;}
 if (type=="AllOrg") {activeTorg=false;activeOrg=false;activeOkdp2=false;activeAllOrg=true;}
 
  typeForm=type;
 this.setState(
 {
  activeTorg:activeTorg,
  activeOrg:activeOrg,
  activeOkdp2:activeOkdp2,
  activeAllOrg:activeAllOrg
 }
  );

 
 updateData ({
  typeForm:typeForm
 });

}

signOut = () =>
{
  var {updateData}=this.props;
 console.log('signOut');
 const GoogleAuth=window.gapi.auth2.getAuthInstance();
 GoogleAuth.signOut().then(()=> {
    updateData ({
      name:''
    });


 },()=> console.log('signOut Error'));

} 

signIn = () =>
{ 
  var {updateData}=this.props;
  const _auth_Ok = GoogleUser => {
    const name = GoogleUser.getBasicProfile().getName();
    const GoogleId = GoogleUser.getBasicProfile().getId();
    const googleEmail =  GoogleUser.getBasicProfile().getEmail();
    
    console.log('Auth ok', name);
    updateData ({
      name:name,
      GoogleId:GoogleId,
      googleEmail:googleEmail
    });

  }
  const _auth_Error = GoogleUser => {
    console.log('Auth Error');
    console.log(GoogleUser);    
  }  
 console.log('signIn');
 const GoogleAuth=window.gapi.auth2.getAuthInstance()
 GoogleAuth.signIn({
   scope: 'profile email'
 }
  ).then(_auth_Ok , _auth_Error);
}

render(){
    let {activeTorg,activeOrg,activeOkdp2,activeAllOrg}=this.state;
    const {typeForm,handleClickSidebarOpen,sidebarOpen,name}=this.props;
    if (typeForm=="Torg") {activeTorg=true;activeOrg=false;activeOkdp2=false;activeAllOrg=false;}
    if (typeForm=="Org") {activeTorg=false;activeOrg=true;activeOkdp2=false;activeAllOrg=false;}
    if (typeForm=="Okdp2") {activeTorg=false;activeOrg=false;activeOkdp2=true;activeAllOrg=false;}
    if (typeForm=="AllOrg") {activeTorg=false;activeOrg=false;activeOkdp2=false;activeAllOrg=true;}

    let classNameTorg = 'nav-item nav-link ';
    let classNameAllOrg = 'nav-item nav-link ';
    let classNameOkdp2 = 'nav-item nav-link ';
    let classNameOrg = 'nav-item nav-link ';

    if (activeTorg) {
     classNameTorg += ' active';
    }

    if (activeOrg) {
     classNameOrg += ' active';
    }

    if (activeOkdp2) {
     classNameOkdp2 += ' active';
    }
    if (activeAllOrg) {
     classNameAllOrg += ' active';
    }
    


return(
<nav className="navbar fixed-top navbar-light bg-light">
  <a className="h1">Торговатор</a>

    <LinkBtn to="/WebApp/Torg" label={'Мои торги'} /> 
    <LinkBtn to="/WebApp/OrgList" label={'Мои заказчики'} /> 
    <LinkBtn to="/WebApp/ALLORG" label={'Все заказчики'} />
    <LinkBtn to="/WebApp/OKDP2" label={'ОКДП2'} />
    <LinkBtn to="/WebApp/about" label={'О приложении'} /> 

    <button onClick={handleClickSidebarOpen} title="Фильтр торгов" className="btn btn-secondary btn-lg float-right">{element}</button>
    <Link to={"/WebApp/Torg"}>
     {!name && <button id="AuthButton" onClick={this.signIn} title="Войти через Google аккаунт" className="btn btn-secondary btn-lg float-right">G Войти </button>}
    </Link> 
    {name && <button onClick={this.signOut} title="Выйти из системы" className="btn btn-secondary btn-lg float-right">G Выйти </button>}    


</nav>


      )

	
	}


}

export default Menu