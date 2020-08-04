# react-native-stream-view

** Note: This is an experimental library and needs a bit of love if you'd like to take it to production. **

Stream Your View to http://your-device-ip:8080.

Android only for now. 

Uses [react-native-view-shot](https://github.com/gre/react-native-view-shot) and [react-native-http-server](https://github.com/windastella/react-native-http-server).

## Install

```shell
npm install --save @windastella/react-native-stream-view
```

## Automatically link

React-Native after 0.60 will automatically link the package.

## Release Notes

See [CHANGELOG.md](https://github.com/windastella/react-native-stream-view/blob/master/CHANGELOG.md)

## Example

First import/require @windastella/react-native-stream-view:

```js

    import StreamView from '@windastella/react-native-stream-view';

```


Use the StreamView as normal View.

```js

    function App () {

        // specify port for custom port
        // hideAddress to hide ip address display 
        return <StreamView port="8080" hideAddress> 
            <Text> view stream of this from "device-ip-address:8080" </Text>
        </StreamView>

    }

```
