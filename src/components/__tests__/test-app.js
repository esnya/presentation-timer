jest.dontMock('../app');

import Storage from 'dom-storage';
import React from 'react';
import {renderIntoDocument} from 'react-addons-test-utils';

describe('test', () => {
    const App = require('../app').App;

    window.localStorage = new Storage(null, { strict: true });

    it('should be able to render', () => {
        renderIntoDocument(<App />);
    });
});