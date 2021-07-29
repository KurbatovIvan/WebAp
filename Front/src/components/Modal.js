import React from 'react';
import PropTypes from 'prop-types';


class Modal extends React.Component {

 constructor (props) {
 super(props);
 this.state = {
  onlyKrista:props.onlyKrista


  }

 }  

update (type) {
 var {onlyKrista, odinS, actualTorg, query, updateData, ittortg, typeForm}=this.props;

// console.log('odinS Before', odinS);
 if (type=="onlyKrista") { onlyKrista=!onlyKrista; if (onlyKrista==true){odinS=false;}} else
 if (type=="actualTorg") { actualTorg=!actualTorg;} else
 if (type=="ittortg") { ittortg=!ittortg;} else
 if (type=="odinS") { odinS=!odinS; if (odinS==true){onlyKrista=false;} } else
 typeForm=type;

// console.log('odinS After', odinS);
 
 updateData ({
  onlyKrista:onlyKrista,
  actualTorg:actualTorg,
  ittortg:ittortg,
  odinS:odinS
 });
    

}

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 150
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };

   const {isOpen, odinS}=this.props;


    return (
      <div className="backdrop_" style={backdropStyle}>
        <div className="modal_" style={modalStyle}>
          {this.props.children}

<h5>
 <div class="form-check">
   <input class="form-check-input" type="checkbox" id="defaultCheck1" checked={this.props.actualTorg} onClick={() => this.update('actualTorg')}></input>
   <label class="form-check-label" for="defaultCheck1">
    Показывать только актуальные на текущую дату
   </label>
 </div>

 <div class="form-check">
   <input class="form-check-input" type="checkbox" id="defaultCheck2" checked={this.props.onlyKrista} onClick={() => this.update('onlyKrista')}></input>
   <label class="form-check-label" for="defaultCheck2">
    Показывать торги только моих организаций
   </label>
 </div>

  <div class="form-check">
   <input class="form-check-input" type="checkbox" id="defaultCheck3" checked={this.props.ittortg} onClick={() => this.update('ittortg')}></input>
   <label class="form-check-label" for="defaultCheck3">
    Торги в сфере информационных технологий (ОКПД2=58,62,63)
   </label>
 </div>

 <div class="form-check">
   <input class="form-check-input" type="checkbox" id="defaultCheck4" checked={this.props.odinS} onClick={() => this.update('odinS')}></input>
   <label class="form-check-label" for="defaultCheck4">
     Показывать торги в которых упоминается 1С
   </label>
 </div>

</h5>

          <div className="footer">
            <button onClick={this.props.onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
