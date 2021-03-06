{
    'conditions': [
        ['OS=="win"', {
            'targets':[
                {
                    'target_name': 'windows_nanomsg',
                    'type': 'static_library',
                    'defines': [
                      'NN_HAVE_GCC',
                      'NN_HAVE_SOCKETPAIR',
                      'NN_HAVE_SEMAPHORE',
                      'NN_USE_PIPE',
                    ],
                    'direct_dependent_settings': {
                      'defines': [
                          'NN_HAVE_GCC',
                          'NN_HAVE_SOCKETPAIR',
                          'NN_HAVE_SEMAPHORE',
                          'NN_USE_PIPE',
                      ],
                    },
                    'include_dirs': [
                        'windows/nanomsg/src'
                    ],
                    'defines': [
                        '_WINDOWS',
                        '_CRT_SECURE_NO_WARNINGS',
                        'NN_HAVE_WINDOWS',
                        'WIN32',
                        'NN_USE_LITERAL_IFADDR',
                        'NN_EXPORTS',
                    ],
                    'link_settings': { 'libraries': [ '-lws2_32.lib', '-lmswsock.lib'] },
                    'direct_dependent_settings': {
                        'defines': [
                            '_WINDOWS',
                            '_CRT_SECURE_NO_WARNINGS',
                            'NN_HAVE_WINDOWS',
                            'WIN32',
                            'NN_USE_LITERAL_IFADDR',
                            'NN_EXPORTS',
                        ],
                        'include_dirs': [ 'windows/nanomsg/src' ],
                    },
                    'target_defaults': {
                        'default_configuration': 'Debug',
                        'configurations': {
                            'Debug': {
                                'defines': [ 'DEBUG', '_DEBUG' ],
                                'msvs_settings': {
                                    'VCCLCompilerTool': {
                                        'RuntimeLibrary': 0, # shared debug
                                    },
                                },
                            },
                            'Release': {
                                'defines': [ 'NDEBUG' ],
                                'msvs_settings': {
                                    'VCCLCompilerTool': {
                                        'RuntimeLibrary': 1, # shared release
                                    },
                                },
                            }
                        },
                        'msvs_settings': {
                            'VCLinkerTool': { 'GenerateDebugInformation': 'true' },
                        },
                    },
                    'include_dirs':[
                        'windows/nanomsg/src',
                        'windows/nanomsg/src/aio',
                        'windows/nanomsg/src/core',
                        'windows/nanomsg/src/devices',
                        'windows/nanomsg/src/protocols',
                        'windows/nanomsg/src/transports',
                        'windows/nanomsg/src/utils'
                    ],
                    'sources': [
                        'windows/nanomsg/src/aio/ctx.c',
                        'windows/nanomsg/src/aio/fsm.c',
                        'windows/nanomsg/src/aio/poller.c',
                        'windows/nanomsg/src/aio/pool.c',
                        'windows/nanomsg/src/aio/timer.c',
                        'windows/nanomsg/src/aio/timerset.c',
                        'windows/nanomsg/src/aio/usock.c',
                        'windows/nanomsg/src/aio/worker.c',
                        'windows/nanomsg/src/core/ep.c',
                        'windows/nanomsg/src/core/epbase.c',
                        'windows/nanomsg/src/core/global.c',
                        'windows/nanomsg/src/core/pipe.c',
                        'windows/nanomsg/src/core/poll.c',
                        'windows/nanomsg/src/core/sock.c',
                        'windows/nanomsg/src/core/sockbase.c',
                        'windows/nanomsg/src/core/symbol.c',
                        'windows/nanomsg/src/devices/device.c',
                        'windows/nanomsg/src/protocols/bus/bus.c',
                        'windows/nanomsg/src/protocols/bus/xbus.c',
                        'windows/nanomsg/src/protocols/pair/pair.c',
                        'windows/nanomsg/src/protocols/pair/xpair.c',
                        'windows/nanomsg/src/protocols/pipeline/pull.c',
                        'windows/nanomsg/src/protocols/pipeline/push.c',
                        'windows/nanomsg/src/protocols/pipeline/xpull.c',
                        'windows/nanomsg/src/protocols/pipeline/xpush.c',
                        'windows/nanomsg/src/protocols/pubsub/pub.c',
                        'windows/nanomsg/src/protocols/pubsub/sub.c',
                        'windows/nanomsg/src/protocols/pubsub/trie.c',
                        'windows/nanomsg/src/protocols/pubsub/xpub.c',
                        'windows/nanomsg/src/protocols/pubsub/xsub.c',
                        'windows/nanomsg/src/protocols/reqrep/rep.c',
                        'windows/nanomsg/src/protocols/reqrep/req.c',
                        'windows/nanomsg/src/protocols/reqrep/task.c',
                        'windows/nanomsg/src/protocols/reqrep/xrep.c',
                        'windows/nanomsg/src/protocols/reqrep/xreq.c',
                        'windows/nanomsg/src/protocols/survey/respondent.c',
                        'windows/nanomsg/src/protocols/survey/surveyor.c',
                        'windows/nanomsg/src/protocols/survey/xrespondent.c',
                        'windows/nanomsg/src/protocols/survey/xsurveyor.c',
                        'windows/nanomsg/src/protocols/utils/dist.c',
                        'windows/nanomsg/src/protocols/utils/excl.c',
                        'windows/nanomsg/src/protocols/utils/fq.c',
                        'windows/nanomsg/src/protocols/utils/lb.c',
                        'windows/nanomsg/src/protocols/utils/priolist.c',
                        'windows/nanomsg/src/transports/inproc/binproc.c',
                        'windows/nanomsg/src/transports/inproc/cinproc.c',
                        'windows/nanomsg/src/transports/inproc/inproc.c',
                        'windows/nanomsg/src/transports/inproc/ins.c',
                        'windows/nanomsg/src/transports/inproc/msgqueue.c',
                        'windows/nanomsg/src/transports/inproc/sinproc.c',
                        'windows/nanomsg/src/transports/ipc/aipc.c',
                        'windows/nanomsg/src/transports/ipc/bipc.c',
                        'windows/nanomsg/src/transports/ipc/cipc.c',
                        'windows/nanomsg/src/transports/ipc/ipc.c',
                        'windows/nanomsg/src/transports/ipc/sipc.c',
                        'windows/nanomsg/src/transports/tcp/atcp.c',
                        'windows/nanomsg/src/transports/tcp/btcp.c',
                        'windows/nanomsg/src/transports/tcp/ctcp.c',
                        'windows/nanomsg/src/transports/tcp/stcp.c',
                        'windows/nanomsg/src/transports/tcp/tcp.c',
                        'windows/nanomsg/src/transports/utils/backoff.c',
                        'windows/nanomsg/src/transports/utils/dns.c',
                        'windows/nanomsg/src/transports/utils/iface.c',
                        'windows/nanomsg/src/transports/utils/literal.c',
                        'windows/nanomsg/src/transports/utils/port.c',
                        'windows/nanomsg/src/transports/utils/streamhdr.c',
                        'windows/nanomsg/src/utils/alloc.c',
                        'windows/nanomsg/src/utils/atomic.c',
                        'windows/nanomsg/src/utils/chunk.c',
                        'windows/nanomsg/src/utils/chunkref.c',
                        'windows/nanomsg/src/utils/clock.c',
                        'windows/nanomsg/src/utils/closefd.c',
                        'windows/nanomsg/src/utils/efd.c',
                        'windows/nanomsg/src/utils/err.c',
                        'windows/nanomsg/src/utils/glock.c',
                        'windows/nanomsg/src/utils/hash.c',
                        'windows/nanomsg/src/utils/list.c',
                        'windows/nanomsg/src/utils/msg.c',
                        'windows/nanomsg/src/utils/mutex.c',
                        'windows/nanomsg/src/utils/queue.c',
                        'windows/nanomsg/src/utils/random.c',
                        'windows/nanomsg/src/utils/sem.c',
                        'windows/nanomsg/src/utils/sleep.c',
                        'windows/nanomsg/src/utils/stopwatch.c',
                        'windows/nanomsg/src/utils/thread.c',
                        'windows/nanomsg/src/utils/wire.c',
                    ]
                }
            ]
        }]
    ],
  'targets': [
    {
      'target_name' : 'nanomsg',
      'include_dirs': [ '<!(node -e "require(\'nan\')")' ],
      'sources': [ 'lib/nanomsg.cc' ],
      'conditions': [
        ['OS=="win"', {
            'dependencies': [ 'windows_nanomsg', ],
        }],
        ['OS=="mac" or OS=="solaris"', {
            'libraries': [ '-lnanomsg' ],
        }],
        ['OS=="openbsd" or OS=="freebsd"', { 'libraries': [ '-lnanomsg' ] }],
        ['OS=="linux"', { 'libraries': [ '-lnanomsg' ] }]
      ]
    }
  ]
}
