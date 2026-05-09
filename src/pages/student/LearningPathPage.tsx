import { useState } from 'react'
import { Brain, CircleCheck as CheckCircle2, Lock, Play, ArrowRight, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface PathNode {
  id: string
  title: string
  type: 'start' | 'content' | 'assessment' | 'branch' | 'end'
  status: 'completed' | 'active' | 'locked'
  xp: number
  description?: string
  score?: number
  x: number
  y: number
}

interface PathEdge {
  from: string
  to: string
  label?: string
  isSuccess?: boolean
}

const NODES: PathNode[] = [
  { id: 'start', title: 'Start', type: 'start', status: 'completed', xp: 0, x: 50, y: 20 },
  { id: 'n1', title: 'Algebra Basics', type: 'content', status: 'completed', xp: 10, description: 'Introduction to variables and expressions', x: 50, y: 100 },
  { id: 'q1', title: 'Algebra Quiz', type: 'assessment', status: 'completed', xp: 25, description: 'Test your algebra knowledge', score: 65, x: 50, y: 190 },
  { id: 'n2', title: 'Fractions', type: 'content', status: 'active', xp: 10, description: 'Working with fractions and ratios', x: 75, y: 280 },
  { id: 'n2b', title: 'Remedial: Algebra', type: 'content', status: 'locked', xp: 10, description: 'Additional algebra practice (unlocked if quiz < 70%)', x: 25, y: 280 },
  { id: 'q2', title: 'Fractions Quiz', type: 'assessment', status: 'locked', xp: 25, description: 'Test your fractions knowledge', x: 75, y: 370 },
  { id: 'n3', title: 'Geometry', type: 'content', status: 'locked', xp: 10, description: 'Shapes, angles, and measurement', x: 50, y: 460 },
  { id: 'end', title: 'Complete!', type: 'end', status: 'locked', xp: 50, x: 50, y: 540 },
]

const EDGES: PathEdge[] = [
  { from: 'start', to: 'n1' },
  { from: 'n1', to: 'q1' },
  { from: 'q1', to: 'n2', label: '≥ 70%', isSuccess: true },
  { from: 'q1', to: 'n2b', label: '< 70%', isSuccess: false },
  { from: 'n2b', to: 'n2' },
  { from: 'n2', to: 'q2' },
  { from: 'q2', to: 'n3' },
  { from: 'n3', to: 'end' },
]

const nodeColor = (status: string, type: string) => {
  if (type === 'start') return '#10B981'
  if (type === 'end') return '#F59E0B'
  if (status === 'completed') return '#2563EB'
  if (status === 'active') return '#0EA5E9'
  return '#CBD5E1'
}

export function LearningPathPage() {
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(NODES[3])

  const completedNodes = NODES.filter((n) => n.status === 'completed').length
  const totalXP = NODES.filter((n) => n.status === 'completed').reduce((s, n) => s + n.xp, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Adaptive Learning Path</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Your path adapts based on your performance. Complete assessments to unlock the next steps.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-600">{completedNodes}</p>
            <p className="text-xs text-slate-400 mt-0.5">Nodes Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{totalXP} XP</p>
            <p className="text-xs text-slate-400 mt-0.5">Earned on Path</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{Math.round((completedNodes / NODES.length) * 100)}%</p>
            <p className="text-xs text-slate-400 mt-0.5">Path Progress</p>
          </CardContent>
        </Card>
      </div>

      <Progress
        value={(completedNodes / NODES.length) * 100}
        className="h-2"
        indicatorClassName="bg-gradient-to-r from-brand-400 to-brand-600"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG path map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-brand-500" />
                Mathematics Learning Path
                <Badge variant="default" className="ml-auto text-xs">Adaptive</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-auto">
                <svg width="100%" viewBox="0 0 600 580" className="min-h-[400px]">
                  {/* Edges */}
                  {EDGES.map((edge, i) => {
                    const from = NODES.find((n) => n.id === edge.from)
                    const to = NODES.find((n) => n.id === edge.to)
                    if (!from || !to) return null
                    const fx = from.x / 100 * 560 + 20
                    const fy = from.y + 20
                    const tx = to.x / 100 * 560 + 20
                    const ty = to.y + 20
                    return (
                      <g key={i}>
                        <line
                          x1={fx} y1={fy} x2={tx} y2={ty}
                          stroke={edge.isSuccess === false ? '#FCA5A5' : edge.isSuccess === true ? '#6EE7B7' : '#CBD5E1'}
                          strokeWidth="2"
                          strokeDasharray={to.status === 'locked' ? '4 4' : undefined}
                        />
                        {edge.label && (
                          <text
                            x={(fx + tx) / 2 + 8}
                            y={(fy + ty) / 2}
                            fontSize="10"
                            fill={edge.isSuccess === false ? '#EF4444' : '#10B981'}
                            fontWeight="500"
                          >
                            {edge.label}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* Nodes */}
                  {NODES.map((node) => {
                    const x = node.x / 100 * 560 + 20
                    const y = node.y + 20
                    const isSelected = selectedNode?.id === node.id
                    const color = nodeColor(node.status, node.type)

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <circle r="26" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
                        )}
                        <circle
                          r="20"
                          fill={color}
                          opacity={node.status === 'locked' ? 0.4 : 1}
                          className="transition-all"
                        />
                        {node.status === 'completed' && (
                          <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white">✓</text>
                        )}
                        {node.status === 'active' && (
                          <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white">▶</text>
                        )}
                        {node.status === 'locked' && (
                          <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="white">🔒</text>
                        )}
                        {(node.type === 'end') && (
                          <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white">★</text>
                        )}
                        <text
                          textAnchor="middle"
                          y="32"
                          fontSize="11"
                          fill={node.status === 'locked' ? '#94A3B8' : '#1E293B'}
                          fontWeight={node.status === 'active' ? '600' : '400'}
                        >
                          {node.title}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node detail */}
        <div>
          {selectedNode ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: nodeColor(selectedNode.status, selectedNode.type) }}
                  >
                    {selectedNode.status === 'completed' ? '✓' : selectedNode.status === 'active' ? '▶' : '🔒'}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{selectedNode.title}</CardTitle>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">{selectedNode.type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedNode.description && (
                  <p className="text-sm text-slate-500">{selectedNode.description}</p>
                )}

                {selectedNode.score !== undefined && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-1">Your Score</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedNode.score}%</p>
                    {selectedNode.score < 70 && (
                      <p className="text-xs text-amber-600 mt-1">
                        Score below 70% — remedial content was unlocked
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                  <Zap className="w-4 h-4" />
                  +{selectedNode.xp} XP reward
                </div>

                {selectedNode.status === 'active' ? (
                  <Button className="w-full gap-2">
                    <Play className="w-4 h-4" />
                    Continue
                  </Button>
                ) : selectedNode.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Lock className="w-4 h-4" />
                    Complete previous steps to unlock
                  </div>
                )}

                {selectedNode.status === 'completed' && (
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    Review Again
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-slate-400">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Click a node to see details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
