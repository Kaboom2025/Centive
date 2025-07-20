"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Heart,
  Star,
  CheckCircle,
  Filter,
  Globe,
  Users,
  Stethoscope,
  GraduationCap,
  TreePine,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Charity {
  id: string
  name: string
  logo: string
  mission: string
  category: string
  rating: number
  description: string
  impactMetrics: string[]
  financialInfo: string
}

const categoryIcons = {
  Environment: TreePine,
  Health: Stethoscope,
  Education: GraduationCap,
  Hunger: Users,
  Global: Globe,
}

export default function CharitySelectionPage() {
  const { selectedCharity, selectCharity, searchCharities } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [charities, setCharities] = useState<Charity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    loadCharities()
  }, [])

  const loadCharities = async () => {
    setIsLoading(true)
    try {
      const results = await searchCharities("")
      setCharities(results)
    } catch (error) {
      console.error("Failed to load charities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const results = await searchCharities(searchQuery, { category: selectedCategory })
      setCharities(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectCharity = (charity: Charity) => {
    selectCharity(charity)
    toast({
      title: "Charity selected!",
      description: `Your donations will now go to ${charity.name}.`,
    })
  }

  const categories = ["Environment", "Health", "Education", "Hunger", "Global"]

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Charity</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a verified charity to receive your round-up donations. All organizations are vetted for transparency
            and impact.
          </p>
        </div>

        {/* Current Selection */}
        {selectedCharity && (
          <Card className="animate-slide-up border-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Currently Selected</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedCharity.logo || "/placeholder.svg"}
                  alt={selectedCharity.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedCharity.name}</h3>
                  <p className="text-muted-foreground">{selectedCharity.mission}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{selectedCharity.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedCharity.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Charities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or cause..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Categories:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("")}
                >
                  All
                </Button>
                {categories.map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {category}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charity Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading charities...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charities.map((charity, index) => {
                const Icon = categoryIcons[charity.category as keyof typeof categoryIcons] || Globe
                const isSelected = selectedCharity?.id === charity.id

                return (
                  <Card
                    key={charity.id}
                    className={`animate-slide-up cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => handleSelectCharity(charity)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={charity.logo || "/placeholder.svg"}
                            alt={charity.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg">{charity.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Icon className="h-3 w-3" />
                                <span>{charity.category}</span>
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{charity.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{charity.mission}</p>
                      <p className="text-sm">{charity.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Impact:</h4>
                        <div className="space-y-1">
                          {charity.impactMetrics.map((metric, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              • {metric}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">{charity.financialInfo}</p>
                      </div>

                      <Button
                        className="w-full"
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectCharity(charity)
                        }}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Select Charity
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!isLoading && charities.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No charities found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or category filters</p>
            </div>
          )}
        </div>

        {/* Featured Charities */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle>Why Choose Verified Charities?</CardTitle>
            <CardDescription>
              All charities on our platform are thoroughly vetted for impact and transparency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Verified Impact</h3>
                <p className="text-sm text-muted-foreground">
                  All charities are verified for their impact and financial transparency
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Highly Rated</h3>
                <p className="text-sm text-muted-foreground">
                  Only charities with high ratings and proven track records are featured
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Direct Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Your donations go directly to programs that make a real difference
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
