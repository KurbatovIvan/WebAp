import React from 'react';
import {Component} from 'react';
import ArticleList from './components/ArticleList'
import Menu from './components/Menu'
import OrgList from './components/OrgList'
import AllOrgList from './components/AllOrgList'
import OKDP2 from './components/OKDP2'
import Modal from './components/Modal'
import 'bootstrap/dist/css/bootstrap.css';
import Login from "./components/Login";
import {Route} from './components/Router';
import About from './components/About';
import './components/body.css';

class App extends Component  {

constructor(props)
{
 super(props);
 this.state = {
 	isLoading:false,
 	sidebarOpen: false,
 	onlyKrista:true,
  ittortg:true,
 	actualTorg:true,
 	odinS:false,
 	typeForm:"Torg",
 	inn:"",
  GoogleId:"",
  googleEmail:"",
  name:"",
  isOpenModal: false   

 }
  this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
}

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }


// Метод чтобы общаться с другими компонентами
// Чтобы детки сообщали папке чего там у них случилось
// http://jsraccoon.ru/react-sort-and-search

updateData(config) {
  const {inn}=this.state;
  console.log('---', 'update Data App');
  
  this.setState(config);

  const {onlyKrista}=this.state;
  console.log('- onlyKrista', onlyKrista);
}


onSetSidebarOpen(open) {
   this.setState({sidebarOpen: open});
   this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
  }

  menuButtonClick(ev) {
    ev.preventDefault();
    this.onSetOpen(!this.state.open);
  }

componentWillMount()
{
 console.log("---","APP will MOUNT")

}

componentWillUpdate(){
  console.log("---","APP Will Update")
}

componentDidUpdate(prevProps, prevState, snapshot) {
  console.log("---","Did Update");
//  const {onlyKrista,actualTorg,odinS,typeForm, ittortg, name}=this.state;
}

 initAuth() {
    window.gapi.load('auth2', function () {
      window.gapi.auth2.init({
        client_id: "484551486444-4mmnvpcniidcos4uds4eu54u4cjm8iaf.apps.googleusercontent.com"
      }).then(googleAuth => {
        if (googleAuth) {
          if (googleAuth.isSignedIn.get()) {
            const googleUser = googleAuth.currentUser.get();
            const googlename = googleUser.getBasicProfile().getName();

            console.log('INIT  GAPI OK');
            console.log('name=',googlename);
// Автоматическая авторизация            
//            if (googlename!=="") {
//            document.getElementById("AuthButton").click();
//             }
          }
        }
      }, ()=> console.log('INIT GAPI ERROR'))
    });
}

loadGapiAndAfterwardsInitAuth() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
    script.defer = true;
    script.onload=this.initAuth;
    const meta = document.createElement("meta");
    meta.name="google-signin-client_id";
    meta.content="484551486444-4mmnvpcniidcos4uds4eu54u4cjm8iaf.apps.googleusercontent.com";
    document.head.appendChild(meta);
    document.head.appendChild(script);
}

componentDidMount(){
  console.log("---","Did Mount App")
  this.loadGapiAndAfterwardsInitAuth();
}

handleClick = () => {
 console.log('---', 'clicked sidebarOpen')
 this.setState(
  {
   sidebarOpen: !this.state.sidebarOpen
   }  
  )
}



render(){
  const bodystyle={
//        'paddingTop':'131px'
        'paddingTop':'5%'

  } 

	const {actualTorg, onlyKrista, odinS, ittortg, typeForm, inn, name, GoogleId, googleEmail}=this.state;



	let {isLoading}=this.state;

    let form;
    let welcom="";
    if (name==="") {
       form="";
       welcom=<h1 align="center">Необходимо авторизоваться !</h1>;
    }
    if (name!=="") {
       welcom=<h3 align="center">Добро пожаловать {name}! Краткая инструкция в разделе о приложении.</h3>;
       form=<div className="content">
        <Route path="/WebApp/Torg" render={()=><ArticleList onlyKrista={onlyKrista} ittortg={ittortg} actualTorg={actualTorg} odinS={odinS} typeForm={typeForm} inn={inn} name={name} GoogleId={GoogleId} googleEmail={googleEmail}/>}/>
        <Route path="/WebApp/about" component={About} />
        <Route path="/WebApp/OrgList" render={()=><OrgList typeForm = {typeForm} inn = {inn} GoogleId={GoogleId} updateData={this.updateData.bind(this)}/>}/>
        <Route path="/WebApp/OKDP2" component={OKDP2} />
        <Route path="/WebApp/ALLORG" render={()=><AllOrgList typeForm = {typeForm} inn = {inn} GoogleId={GoogleId} updateData={this.updateData.bind(this)}/>}/>
      </div>;
    } else {
       form=      <div className="content">
        <Route path="/WebApp/about" component={About} />
      </div>;      
    }
	return (
      <div> 
        <h2>
           <Menu
            handleClickSidebarOpen={this.onSetSidebarOpen}
            sidebarOpen={this.state.sidebarOpen}           
    		    typeForm = {typeForm}
            name = {name}
			      updateData={this.updateData.bind(this)}
           />
   	    </h2>
        
      <body>
           {welcom}
           {form}

        <Modal show={this.state.sidebarOpen}                            
          onClose={this.onSetSidebarOpen}
          actualTorg={actualTorg}
          onlyKrista={onlyKrista}
          ittortg={ittortg}
          odinS={odinS}
          updateData={this.updateData.bind(this)}>
          ФИЛЬТР 
        </Modal>

      </body>
	   </div>
	)
	
	}
}

export default App