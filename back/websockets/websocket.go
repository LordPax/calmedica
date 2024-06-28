package websockets

import (
	"fmt"
	"hackathon/middlewares"
	"hackathon/models"
	"hackathon/services"

	"github.com/gin-gonic/gin"
)

func RegisterWebsocket(r *gin.Engine) {
	ws := services.GetWebsocket()

	ws.OnConnect(connect)
	ws.OnDisconnect(disconnect)

	r.GET("/ws",
		middlewares.IsLoggedIn(true),
		ws.GinWsHandler,
	)
}

func connect(client *services.Client, c *gin.Context) error {
	user, _ := c.MustGet("connectedUser").(models.User)

	client.Set("user", user)

	fmt.Printf("Client %s connected, name %s, len %d\n",
		client.ID,
		user.Username,
		len(client.Ws.GetClients()),
	)

	if err := client.Emit("connected", nil); err != nil {
		return err
	}

	return nil
}

func disconnect(client *services.Client) error {
	user := client.Get("user").(models.User)

	fmt.Printf("Client %s disconnected, name %s, len %d\n",
		client.ID,
		user.Username,
		len(client.Ws.GetClients()),
	)

	return nil
}
