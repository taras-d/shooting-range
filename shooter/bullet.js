
(function() {

    var BulletResult = { 
        None: 0,
        Miss: 1, 
        Hit: 2
    };

    Shooter.Bullet = Bullet;
    Shooter.BulletResult = BulletResult;

    function Bullet(ctx, x, y, radius, fill) {

        this.ctx = ctx;

        this.radius = radius;
        this.fill = fill;

        this.result = BulletResult.None;

        this.moveX(x);
        this.moveY(y);
    }

    Bullet.prototype.moveX = function(x) {
        this.x = x;
        this.left = x - this.radius;
        this.right = x + this.radius;
    }

    Bullet.prototype.moveY = function(y) {
        this.y = y;
        this.top = y - this.radius;
        this.bottom = y + this.radius;
    }

    Bullet.prototype.draw = function() {

        var ctx = this.ctx;

        ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

})();