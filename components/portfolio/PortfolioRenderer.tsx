import React from "react";
import Socials from "./modules/Socials";

export interface PortfolioModule {
  type: string,
  width?: number,
  title?: string,
  socials?: {
    type: string,
    display: string,
    link?: string
  }[]
}

interface PortfolioRendererProps {
  portfolioData: {
    modules: PortfolioModule[],
  },
  editing: Boolean,
  updateState: Function
}

interface PortfolioRendererState {

}

class PortfolioRenderer extends React.Component<PortfolioRendererProps, PortfolioRendererState> {
  constructor(props: PortfolioRendererProps) {
    super(props);

    this.state = {

    };
  }

  render() {
    if (!this.props.portfolioData) return <></>;

    return (
      <div className="flex flex-col items-center w-full mt-2">
        {this.props.portfolioData.modules.map((module, index) => {
          switch (module.type) {
            case "socials":
              return <Socials updateState={(content: any) => {
                this.props.portfolioData.modules[index] = content;
                this.props.updateState({
                  pageData: this.props.portfolioData
                });
              }} module={module} editing={this.props.editing} key={index}/>
              break;
          
            default:
              return <></>
              break;
          }
        })}
      </div>
    )
  }
}

export default PortfolioRenderer;