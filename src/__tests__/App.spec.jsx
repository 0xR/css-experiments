import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App.jsx';

describe('App component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('works with chai', () => {
    expect({ a: 1 }).to.deep.equal({ a: 1 });
    expect({ a: 1 }).not.to.deep.equal({ a: 2 });

    const spy = sinon.spy();
    expect(spy).not.to.have.been.calledWith();
    spy();
    expect(spy).to.have.been.calledWith();
  });

  it('works with jasmine', () => {
    expect({ a: 1 }).toEqual({ a: 1 });
    expect({ a: 1 }).not.toEqual({ a: 2 });

    const spy = jest.fn();
    expect(spy).not.toHaveBeenCalled();
    spy();
    expect(spy).toHaveBeenCalled();
  });
});
