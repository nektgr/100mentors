"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Send } from "lucide-react"

interface Tweet {
  id: string
  content: string
  createdAt: Date
}

export default function TweetApp() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [newTweet, setNewTweet] = useState("")
  const maxLength = 280

  const handleCreateTweet = () => {
    if (newTweet.trim() === "" || newTweet.length > maxLength) return

    const tweet: Tweet = {
      id: Date.now().toString(),
      content: newTweet,
      createdAt: new Date(),
    }

    setTweets([tweet, ...tweets])
    setNewTweet("")
  }

  const handleDeleteTweet = (id: string) => {
    setTweets(tweets.filter((tweet) => tweet.id !== id))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Tweet App</h1>

      {/* Create Tweet Form */}
      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder="What's happening?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            className="resize-none min-h-[100px]"
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${newTweet.length > maxLength ? "text-red-500" : "text-muted-foreground"}`}>
              {newTweet.length}/{maxLength}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleCreateTweet}
            disabled={newTweet.trim() === "" || newTweet.length > maxLength}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Tweet
          </Button>
        </CardFooter>
      </Card>

      {/* Tweet List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tweets</h2>

        {tweets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tweets yet. Create your first tweet!</p>
        ) : (
          tweets.map((tweet) => (
            <Card key={tweet.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>ME</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">You</p>
                        <p className="text-xs text-muted-foreground">{formatDate(tweet.createdAt)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTweet(tweet.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete tweet</span>
                      </Button>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{tweet.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

