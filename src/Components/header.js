import React from 'react'

import './header.css'

class NTIHeader extends React.Component {
  constructor(props) {
    super(props);
    this.title = props.title;
  }
  render() {
    return <h1 className='headerText'> {this.props.title} </h1>;
  }
}

export default NTIHeader;
