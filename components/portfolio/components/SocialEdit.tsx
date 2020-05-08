import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";

class SocialEdit extends React.Component {
  props: {
    add?: Boolean,
    social?: {
      type: string,
      display: string,
      link?: string
    },
    updateState: Function
  } = this.props;

  state: {
    expanded: Boolean
  } = {
    expanded: false
  };

  render() {
    if (this.props.add) {
      return (
        <FontAwesomeIcon className="mb-4 text-green-500 text-3xl transform transition duration-200 ease-in-out hover:scale-105 cursor-pointer" icon={faPlusCircle} />
      );
    }
    
    if (this.state.expanded) {
      return (
        <div className="flex justify-center items-center mb-4 bg-gray-200 rounded-lg">
          <div className="flex items-center my-2 p-2">
            <span className="text-gray-900 text-xl font-semibold mr-2">Social Type</span>
            <input className="rounded-md w-48 m-0" value={this.props.social?.type || ""} onChange={() => {
              
            }} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center mb-4 bg-gray-200 p-2 rounded-lg  transform transition duration-200 ease-in-out hover:scale-105 cursor-pointer" style={{
        minWidth: "30%"
      }} onClick={() => {
        this.setState({
          expanded: true
        });
      }}>
        <span className=" text-xl text-gray-800 font-semibold mr-2">{this.props.social?.type![0].toUpperCase() + this.props.social?.type.slice(1)}</span>
        <FontAwesomeIcon className="text-gray-800 text-2xl" icon={faEdit} />
      </div>
    );
  }
}

export default SocialEdit;