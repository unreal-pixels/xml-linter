import React from 'react';
import './App.scss';
import { GoogleAd, Header, Wrapper } from '@unrealpixels/common-lib';
import { type RouteComponentProps, withRouter } from 'react-router-dom';
import { XMLParser } from 'fast-xml-parser';
import xmlButPrettier from 'xml-but-prettier';

class App extends React.Component<RouteComponentProps> {
  state = {
    text: '',
    error: false,
    errorReason: '',
  };

  private convert = (): void => {
    const { text } = this.state;

    try {
      const parser = new XMLParser({ allowBooleanAttributes: true });
      const newValue: unknown = parser.parse(text, true);

      this.setState({ error: false, text: JSON.stringify(newValue, undefined, 2) });
    } catch (error) {
      this.setState({ error: true, errorReason: String(error) });
    }
  };

  private lint = (): void => {
    const { text } = this.state;

    try {
      const parser = new XMLParser({ allowBooleanAttributes: true });
      parser.parse(text, true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const newValue: unknown = xmlButPrettier(text);
      this.setState({ error: false, text: newValue });
    } catch (error) {
      this.setState({ error: true, errorReason: String(error) });
    }
  };

  componentDidMount (): void {
    const { history } = this.props;
    const route = localStorage.getItem('route');

    if (route) {
      localStorage.removeItem('route');
      history.push(route);
    }
  }

  render (): React.ReactNode {
    const { text, error, errorReason } = this.state;

    return (
      <>
        <Header productName="XML Linter" productId="json-linter" />
        <Wrapper>
          {error && <div className="data-error"><pre>{errorReason}</pre></div>}
          <label className="data-entry--label" htmlFor="data-entry">Enter or Paste XML</label>
          <textarea className="data-entry" rows={25} id='data-entry' value={text} onChange={event => { this.setState({ text: event.target.value }); }} />
          <button type="button" className="data-entry--button" disabled={!text} onClick={this.lint}>Lint XML</button>
          <button type="button" className="data-entry--button" disabled={!text} onClick={this.convert}>XML to JSON</button>
          <GoogleAd adSlot="3684249047" />
        </Wrapper>
      </>
    );
  }
}

export default withRouter(App);
