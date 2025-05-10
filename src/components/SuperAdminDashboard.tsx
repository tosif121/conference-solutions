'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  Users, 
  Phone, 
  Video, 
  ArrowUpRight, 
  Activity, 
  BarChart3,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuperAdminDashboard() {
  // Mock recent activity data
  const recentActivity = [
    { id: 1, action: "Admin created", user: "System", target: "Sarah Johnson", time: "10 minutes ago" },
    { id: 2, action: "DID assigned", user: "John Admin", target: "+911234567890", time: "2 hours ago" },
    { id: 3, action: "Conference started", user: "Alice Admin", target: "Sales Team", time: "3 hours ago" },
    { id: 4, action: "Admin login", user: "Bob Miller", target: "", time: "Yesterday" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Super Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor system activity and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></span>
            System Online
          </span>
          <Button variant="outline" size="sm" className="ml-2">
            View System Status
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Admins</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">5</h2>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+2 this month</span>
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total DIDs Assigned</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">12</h2>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+3 this month</span>
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Live Conferences</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">2</h2>
                <p className="text-sm text-amber-600 dark:text-amber-500 mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Active now</span>
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {item.action.includes("Admin") && <Users className="h-3.5 w-3.5" />}
                    {item.action.includes("DID") && <Phone className="h-3.5 w-3.5" />}
                    {item.action.includes("Conference") && <Video className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.action}
                        {item.target && <span className="font-normal"> - {item.target}</span>}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">by {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">System Overview</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Storage</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">68%</p>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">CPU Usage</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">43%</p>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-2/5"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Memory</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">72%</p>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Last checked:</span>
                  <span className="text-slate-500 dark:text-slate-400">10 minutes ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}