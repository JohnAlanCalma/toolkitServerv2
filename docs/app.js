var viewer, svf;
var markup;
var ServerURL = 'http://localhost:3000';


// Vue.js components
window.app = new Vue({
    el: "#app",

    data: {
        form: {urn: null, token: null, scene: null },
        Items: []
    },
    methods: {

        init: function() {
            this.Items = _adsk.files;
            this.form.token = _adsk.token.access_token;
            this.form.scene = 'test';
        },

        loadModel: function(urn) {
            this.form.urn = urn.slice(4);
            options = {
                useADP: false,
                env: "AutodeskProduction",
                accessToken: _adsk.token.access_token,
                isAEC:true
            };
            viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById('forgeViewer'));
            Autodesk.Viewing.Initializer(options);
            Autodesk.Viewing.Document.load(urn, (doc) =>{
                var geometries = doc.getRoot().search({ 'type': 'geometry', 'role': '3d' });
                svf = doc.getViewablePath(geometries[0]);
                viewer.start(svf, { sharedPropertyDbPath: doc.getPropertyDbPath() });
            });
        },

        uploadFile: function() {
            this.Items.push({
                objectKey: 'new item',
                status: 'uploading'
            });
        },

        pollProgress: function(sceneid) {
            fetch(`${ServerURL}/api/getstatus${sceneid}`).then((res) => res.json()).then((json) => {
                console.log('createdScene');
            });
        },

        createScene: function(item) {
            fetch(`${ServerURL}/api/createscene${item.objectId}`).then((res) => res.json()).then((json) => {
                console.log('createdScene');
            });
        },

    }
})

app.init();
devicePixelRatio = 1.25;