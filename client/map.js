var Map = {
  basicMap: {
    layers: [
        {physics: '', collides: true, depth: 0}
    ],
    initialize: function(main) {
      this.layers.forEach(layer => {
        if(layer.collides) {
            layer.physics.setCollisionByProperty({collides: true});
            main.physics.add.collider(main.player.physics, layer.physics);
        }
        layer.physics.setDepth(layer.depth);
      });
    }
  }
}