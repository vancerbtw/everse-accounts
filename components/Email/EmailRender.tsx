import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

class EmailRender extends React.Component<{
  email: any,
  super: any,
  index: any,
  emails: any
}> {

  render() {
    const date = new Date(Date.parse(this.props.email.time));
    let day = "Today, ";
    if (!datesAreOnSameDay(date, new Date())) {
      if (datesAreOnSameDay(date, new Date(new Date().setDate(new Date().getDate()-1)))) {
        day = "Yesterday, ";
      } else {
        day = `${date.toLocaleString('default', { month: 'short' })} ${date.getDay()}, `;
      }
    }

    const dayLabel = `${day}${((date.getHours() + 11) % 12 + 1)}:${(date.getMinutes()<10?'0':'') + date.getMinutes()} ${date.getHours() >= 12 ? "PM": "AM"}`;

    return (
      <div className="email-content-container w-full h-full overflow-hidden px-12 pt-6">
        <div className="email-preview-header w-full flex justify-start">
          <div className="rounded-full bg-gray-400 flex justify-center items-center" style={{
            height: "2.75rem",
            width: "2.75rem"
          }}>
            <img className="profile-picture h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${this.props.email.external_display}&background=2196F3&color=ffffff&bold=true`}></img>
          </div>
          <div className="flex items-center">
            <span className=" inline-block mx-2 font-medium align-middle text-lg text-gray-700">
              {this.props.email.external_display?.replace("+", " ") || ""}
              {
                !this.props.email.external_display?.includes("@") && (
                  <span className="inline-block text-sm text-gray-600 self-start font-normal mx-1">&lt;{this.props.email.external}&gt;</span>
                )
              }
            </span>
          </div>
          <div className="flex ml-auto">
            <FontAwesomeIcon className="mx-1 text-xl text-gray-800 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" icon={this.props.email.starred ? fasFaStar : farFaStar} onClick={async () => {
              let status = !this.props.emails[this.props.index].starred || false;
              console.log(this.props.emails[this.props.index])
              let emails = this.props.emails;
              
              emails[this.props.index].starred = status;

              this.props.super.setState({
                emails
              });
              
              await fetch(`/email/v1/${status ? "star": "unstar"}/${this.props.email.message_id}`, {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
                }
              });
            }}/>
            <FontAwesomeIcon className="mx-1 text-xl text-gray-800 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" icon={faTrashAlt} onClick={async () => {
              let emails = this.props.emails;

              emails.splice(this.props.index, 1)

              this.props.super.setState({
                emails: emails,
                activeEmail: undefined
              });
              
              await fetch(`/email/v1/del/${this.props.email.message_id}`, {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
                }
              });
            }}/>
          </div>
        </div>
        <div className="time text-sm mt-3" style={{ color: "rgb(158, 158, 162)" }}>{dayLabel}</div>
        <div className="time text-3xl text-gray-800 font-medium">{this.props.email.subject}</div>
        <p className="time text-base mt-2 text-gray-600" style={{ color: "rgb(158, 158, 162)" }}>{this.props.email.body}</p>
      </div>
    )
  }
}

export default EmailRender;