import './Modal.css'
import { MdClose } from "react-icons/md";

const Modal = ({ visible, title, desc, onClose, buttonVisible = false, onButtonPress, buttonText = "Ok" }) => {

    if (!visible) return null;

    return (
        <>
            <div className="modal">
                <MdClose className='modal-close' onClick={onClose} />
                <hr />
                <div className="modal-body">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    {buttonVisible && <button onClick={onButtonPress} className='modal-button'>{buttonText}</button>}
                </div>
            </div>
        </>
    )
}

export default Modal