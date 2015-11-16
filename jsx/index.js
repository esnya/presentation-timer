'use strict';

import React from 'react';

import {Dialog, FlatButton, Styles, TextField} from 'material-ui';

var App = React.createClass({
    getInitialState: function () {
        var prev = localStorage.getItem('bell');
        return {
            offset: 0,
            t0: Date.now(),
            time: 0,
            running: false,
            dirty: false,
            bell: prev ? JSON.parse(prev) : [15, 18],
            played: [],
        };
    },

    componentDidMount: function () {
        this.timer = setInterval(function () {
            if (this.state.running) {
                var time = Math.floor((Date.now() - this.state.t0) / 1000) + this.state.offset;

                var state = {
                    time: time
                };

                for (var i = 0; i < 2; i++) {
                    if (!this.state.played[i] && time >= this.state.bell[i] * 60) {
                        this.state.played[i] = true;
                        this.bell(i + 1);
                        break;
                    }
                }

                this.setState(state);
            }
        }.bind(this), 200);
    },

    start: function () {
        this.setState({
            offset: this.state.time,
            t0: Date.now(),
            running: true,
            dirty: true,
        });
    },

    stop: function () {
        this.setState({
            running: false,
            dirty: true,
        });
    },

    config: function () {
        this.refs.config.show();
    },
    dismissConfig: function () {
        this.refs.config.dismiss();
    },

    reset: function () {
        this.setState({
            offset: 0,
            t0: Date.now(),
            time: 0,
            running: false,
            dirty: false,
            played: [],
        });
    },

    bell: function (n) {
        var bell = document.createElement('audio');
        bell.src = 'bell.mp3';
        bell.preload = true;
        bell.play();

        if (n > 1) {
            setTimeout(function () {
                this.bell(n - 1);
            }.bind(this), 750);
        }
    },

    setBell: function (value, n) {
        var bell = this.state.bell;
        bell[+n] = +value || undefined;

        this.setState({bell: bell});

        localStorage.setItem('bell', JSON.stringify(bell));
    },

    setBell_1: function (e) {
        this.setBell(e.target.value, 1);
    },
    setBell_2: function (e) {
        this.setBell(e.target.value, 2);
    },

    render: function () {
        var time = this.state.time;

        var m = Math.floor(time / 60);
        var s = time % 60;
        //if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        var styles = {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: 'white',
                transition: 'all ease-in-out 0.2s',
            },
            control: {
                padding: '8px',
                flex: '0 0 auto',
                textAlign: 'center',
            },
            bell: {
                textAlign: 'center',
            },
            timer: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                //flex: '1 1 auto',
                textAlign: 'center',
                fontSize: Math.min(window.innerWidth / 6, window.innerHeight / 2) + 'pt',
            },
            button: {
                margin: '0 4px',
            },
            field: {
                display: 'block',
                width: '100%',
            },
        };

        var colors = [
            Styles.Colors.blue600,
            Styles.Colors.orange800,
            Styles.Colors.red800,
        ];

        styles.container.backgroundColor = colors[2];
        for (var i = 0; i < 2; i++) {
            if (m < this.state.bell[i]) {
                styles.container.backgroundColor = colors[i];
                break;
            }
        }

        var startstop = this.state.running
            ? <FlatButton style={styles.button} onClick={this.stop}>stop</FlatButton>
            : <FlatButton style={styles.button} onClick={this.start}>start</FlatButton>;
        
        var reset = (this.state.running || !this.state.dirty)
            ? undefined
            : <FlatButton style={styles.button} onClick={this.reset}>reset</FlatButton>;

        var config = this.state.running
            ? undefined
            : <FlatButton style={styles.button} onClick={this.config}>config</FlatButton>;

        var fields = this.state.bell.map(function (value, i) {
            var handleChange = function (e) {
                this.setBell(e.target.value, i);
            }.bind(this);

            return (
                    <TextField 
                        key={i}
                        floatingLabelText={'Bell ' + (i + 1)}
                        value={value}
                        style={styles.field}
                        onChange={handleChange} />
                   );

        }, this);

        var bell = this.state.bell.map(function (bell) {
            return bell + 'm';
        }).join(' / ');

        return (
                <div style={{width: '100%', height: '100%'}}>
                    <Dialog
                        ref="config"
                        title="Config"
                        actions={[{text: 'OK', ref: 'OK', onClick: this.dismissConfig}]}
                        actionFocus="OK"
                        openImmediately={true}
                        modal={true}>
                        {fields}
                    </Dialog>
                    <div style={styles.container}>
                        <div style={styles.timer}>
                            {m + ':' + s}
                        </div>
                        <div style={styles.bell}>
                            {bell}
                        </div>
                        <div style={styles.control}>
                            {startstop} {reset} {config}
                        </div>
                    </div>
                </div>
               );
    }
});

React.render(
        <App />,
        document.body);
