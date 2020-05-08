import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons'

class Social extends React.Component {
  props: {
    type: string,
    display?: string,
    link?: string
  } = this.props;

  render() {
    let icon = "";

    switch (this.props.type) {
      case "github":
        icon = "https://image.flaticon.com/icons/svg/25/25231.svg";
        break;
    
      case "twitter":
        icon = "https://seeklogo.com/images/T/twitter-logo-A84FE9258E-seeklogo.com.png";
        break;

      default:
        break;
    }

    return (
      <div className="block flex flex-col justify-center items-center h-20 mx-2">
        <img className={`w-10 h-10 object-contain ${this.props.link !== undefined ? "transform transition duration-200 ease-in-out hover:scale-110 cursor-pointer": ""}`} src={icon}/>
        <span className="font-medium text-gray-700">{this.props.display}</span>
      </div>
    )
  }
}

export default Social;