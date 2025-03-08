
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Search, ExternalLink, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for government schemes
const govtSchemes = [
  {
    id: 1,
    title: "PM-KISAN",
    description: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families",
    eligibility: "All landholding farmers with cultivable land",
    benefits: "Financial assistance of ₹6,000 per year",
    applicationProcess: "Apply online through PM-KISAN portal or visit nearest Common Service Centre",
    category: "Financial Support",
    deadline: "Open throughout the year",
    link: "https://pmkisan.gov.in/",
  },
  {
    id: 2,
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme to provide financial support to farmers in case of crop failure due to natural calamities",
    eligibility: "All farmers growing notified crops in notified areas",
    benefits: "Insurance coverage for crop losses",
    applicationProcess: "Apply through local banks, insurance companies or online portal",
    category: "Crop Insurance",
    deadline: "Before the start of crop season",
    link: "https://pmfby.gov.in/",
  },
  {
    id: 3,
    title: "Soil Health Card Scheme",
    description: "Provides information on soil health to farmers to help improve productivity through judicious use of inputs",
    eligibility: "All farmers",
    benefits: "Free soil testing and recommendations for nutrients and fertilizers",
    applicationProcess: "Contact local agriculture office or apply online",
    category: "Soil Management",
    deadline: "Open throughout the year",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    id: 4,
    title: "Kisan Credit Card (KCC)",
    description: "Provides farmers with affordable credit for their agricultural expenses",
    eligibility: "All farmers, sharecroppers, tenant farmers, and oral lessees",
    benefits: "Credit up to ₹3 lakh at subsidized interest rates",
    applicationProcess: "Apply at local banks or cooperative societies",
    category: "Financial Support",
    deadline: "Open throughout the year",
    link: "https://www.nabard.org/content.aspx?id=593",
  },
];

const categoryColors: Record<string, string> = {
  "Financial Support": "bg-green-100 text-green-800 border-green-200",
  "Crop Insurance": "bg-blue-100 text-blue-800 border-blue-200",
  "Soil Management": "bg-amber-100 text-amber-800 border-amber-200",
  "Other": "bg-purple-100 text-purple-800 border-purple-200",
};

const Schemes = () => {
  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Government Schemes</h2>
          <div className="flex items-center">
            <Badge className="bg-agribuddy-primary text-white">Updated: Last month</Badge>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Find Government Schemes</CardTitle>
              <CardDescription>
                Search for agricultural schemes that you may be eligible for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="Search schemes by keyword" />
                </div>
                <div className="flex-none">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="financial">Financial Support</SelectItem>
                      <SelectItem value="insurance">Crop Insurance</SelectItem>
                      <SelectItem value="soil">Soil Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Schemes</CardTitle>
            <CardDescription>
              Explore government schemes that can benefit your farming operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {govtSchemes.map((scheme) => (
                <AccordionItem key={scheme.id} value={`scheme-${scheme.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center text-left">
                      <FileText className="h-5 w-5 mr-2 text-agribuddy-primary" />
                      <div>
                        <div className="font-medium">{scheme.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {scheme.description}
                        </div>
                      </div>
                    </div>
                    <Badge className={`ml-4 ${categoryColors[scheme.category] || ""}`}>
                      {scheme.category}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      <div>
                        <h4 className="font-semibold">Description:</h4>
                        <p>{scheme.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Eligibility:</h4>
                        <p>{scheme.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Benefits:</h4>
                        <p>{scheme.benefits}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Application Process:</h4>
                        <p>{scheme.applicationProcess}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Deadline:</h4>
                        <p>{scheme.deadline}</p>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Official Website
                        </a>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Load More Schemes</Button>
          </CardFooter>
        </Card>
      </div>
    </Dashboard>
  );
};

export default Schemes;
