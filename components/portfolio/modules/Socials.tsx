import React from "react";
import {PortfolioModule} from "../PortfolioRenderer";
import Social from "../components/Social";
import SocialEdit from "../components/SocialEdit";


class Socials extends React.Component {
  props: {
    module: PortfolioModule,
    editing: Boolean,
    updateState: Function
  } = this.props;

  render() {
    return (
      <>
        {
          this.props.editing && (
            <div className="flex flex-col items-center bg-gray-300 rounded-lg" style={{
              minWidth: `${this.props.module.width || 40}%`,
              maxWidth: "95%"
            }}>
              <span className="text-2xl font-semibold mt-2 mb-2 text-gray-800">Edit Socials</span>
              {this.props.module.socials?.map(((social, index) => {
                return (
                  <SocialEdit updateState={(content: any) => {
                      this.props.module.socials![index] = content;
                      this.props.updateState(this.props.module);
                  }} social={this.props.module.socials!} key={index} />
                );
              }))}
              <SocialEdit add={true} updateState={this.props.updateState}/>
            </div>
          ) || (
            <div className="flex justify-evenly items-center h-24 bg-gray-300 rounded-lg" style={{
              minWidth: `${this.props.module.width || 40}%`,
              maxWidth: "95%"
            }}>
              {this.props.module.socials?.map(((social, index) => {
                return (
                  <Social type={social.type} display={social.display} link={social.link} key={index} />
                );
              }))}
            </div>
          )
        }
      </>
    );
  }
}

export default Socials;